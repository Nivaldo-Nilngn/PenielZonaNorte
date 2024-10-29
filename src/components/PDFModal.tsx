import React, { useState } from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { categories } from '../data/categories';
import { Item } from '../types/Item';

interface PDFModalProps {
  show: boolean;
  onClose: () => void;
  filteredList: Item[];
  selectedMonth: string;
  selectedYear: string;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
}

const PDFModal: React.FC<PDFModalProps> = ({
  show,
  onClose,
  filteredList,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}) => {
  const [reportType, setReportType] = useState<'monthly' | 'daily'>('monthly');
  const [selectedDate, setSelectedDate] = useState('');
  const [churchName, setChurchName] = useState(''); // Novo estado para armazenar o nome da igreja

  const categoryTranslations: { [key: string]: string } = {
    tithe: "Dízimo",
    offering: "Oferta",
    specialOffering: "Oferta Especial",
    billsToPay: "Aluguel",
    electricity: "Conta de Luz",
    water: "Conta de Água",
    internet: "Internet",
    waterPurchase: "Compra de Água",
    cleaningProducts: "Produtos de Limpeza",
    disposableCups: "Copos Descartáveis",
    genericExpense: "Saída"
  };

  const fetchDatabaseName = (uid: string) => {
    const databaseNames = ['PenielZonaNote', 'PenielIbura', 'PenielIpsep'];
    const churchNames = {
      PenielZonaNote: 'IGREJA PENIEL ZONA NORTE',
      PenielIbura: 'IGREJA PENIEL IBURA',
      PenielIpsep: 'IGREJA PENIEL IPSEP',
    };

    databaseNames.forEach(dbName => {
      const usersRef = ref(db, `${dbName}/usuarios`);
      onValue(usersRef, snapshot => {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.key === uid) {
            setDbName(dbName);
            setHeaderText(churchNames[dbName as keyof typeof churchNames]);
            setChurchName(churchNames[dbName as keyof typeof churchNames]); // Atualiza o nome da igreja
          }
        });
      });
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let filteredItems = [];

    if (reportType === 'monthly') {
      filteredItems = filteredList.filter(item => {
        const itemDate = new Date(item.date);
        const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
        const itemYear = itemDate.getFullYear().toString();
        return itemMonth === selectedMonth && itemYear === selectedYear;
      });
    } else {
      filteredItems = filteredList.filter(item => 
        new Date(item.date).toISOString().split('T')[0] === selectedDate
      );
    }

    doc.setFontSize(20);
    doc.text(
      `RELATÓRIO FINANCEIRO - ${churchName}`, // Usando o nome da igreja aqui
      doc.internal.pageSize.getWidth() / 2,
      16,
      { align: 'center' }
    );

    const incomeData = filteredItems
      .filter(item => !categories[item.category]?.expense)
      .map(item => [
        item.title,
        categoryTranslations[item.category] || item.category,
        `R$ ${item.value.toFixed(2)}`,
        new Date(item.date).toLocaleDateString('pt-BR'),
      ]);

    doc.autoTable({
      head: [['Título', 'Categoria', 'Valor', 'Data']],
      body: incomeData,
      startY: 40,
      margin: { top: -20 },
      styles: { cellPadding: 2 },
      theme: 'striped',
    });

    const totalIncome = incomeData.reduce(
      (total, item) => total + Number(item[2].replace('R$ ', '').replace(',', '.')),
      0
    );
    doc.text(
      `Total de Receitas: R$ ${totalIncome.toFixed(2)}`,
      14,
      doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 30
    );

    const expenseData = filteredItems
      .filter(item => categories[item.category]?.expense)
      .map(item => [
        item.title,
        categoryTranslations[item.category] || item.category,
        `R$ ${item.value.toFixed(2)}`,
        new Date(item.date).toLocaleDateString('pt-BR'),
      ]);

    doc.autoTable({
      head: [['Título', 'Categoria', 'Valor', 'Data']],
      body: expenseData,
      startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 30 : 50,
      theme: 'grid',
      headStyles: { fillColor: [255, 0, 0] },
      styles: { cellPadding: 2 },
    });

    const totalExpense = expenseData.reduce(
      (total, item) => total + Number(item[2].replace('R$ ', '').replace(',', '.')),
      0
    );
    doc.text(
      `Total de Despesas: R$ ${totalExpense.toFixed(2)}`,
      14,
      doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 30
    );

    const balance = totalIncome - totalExpense;
    const finalY = doc.internal.pageSize.getHeight() - 20;
    const balanceText = `Balanço: R$ ${balance.toFixed(2)}`;

    doc.text(balanceText, doc.internal.pageSize.getWidth() - 14, finalY, { align: 'right' });

    // Usando o nome da igreja no nome do arquivo PDF
    doc.save(`relatorio_financeiro_${churchName.replace(/\s+/g, '_').toLowerCase()}_${reportType === 'monthly' ? `${selectedMonth}_${selectedYear}` : selectedDate}.pdf`);
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <h2>Selecionar Tipo de Relatório</h2>
        <Select onChange={e => setReportType(e.target.value as 'monthly' | 'daily')}>
          <option value="monthly">Mensal</option>
          <option value="daily">Diário</option>
        </Select>
        {reportType === 'monthly' ? (
          <Input
            type="month"
            value={`${selectedYear}-${selectedMonth}`}
            onChange={e => {
              const [year, month] = e.target.value.split("-");
              setSelectedYear(year);
              setSelectedMonth(month);
            }}
          />
        ) : (
          <Input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        )}
        <Button onClick={generatePDF}>Gerar PDF</Button>
        <Button onClick={onClose}>Fechar</Button>
      </ModalContent>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;  /* Ensure modal is on top of other content */
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #ffffff, #f2f2f2);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 90%; /* Responsive width */
  max-width: 500px; /* Maximum width for larger screens */

  h2 {
    margin-bottom: 20px;
    font-size: 1.5em; /* Increase title size */
    color: #333;
  }

  @media (max-width: 600px) {
    padding: 15px;
    h2 {
      font-size: 1.25em; /* Smaller title on mobile */
    }
  }
`;

const Select = styled.select`
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1em; /* Increase font size */
  background-color: #f9f9f9;

  &:focus {
    border-color: #007BFF;
    outline: none;
    background-color: #ffffff; /* Highlight background on focus */
  }
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1em;

  &:focus {
    border-color: #007BFF;
    outline: none;
    background-color: #ffffff; /* Highlight background on focus */
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  margin: 5px;
  background-color: #007BFF;
  color: #FFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;

export default PDFModal;