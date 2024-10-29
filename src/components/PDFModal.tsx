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
  headerTitle: string;
}

const PDFModal: React.FC<PDFModalProps> = ({
  show,
  onClose,
  filteredList,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  headerTitle,
}) => {
  const [reportType, setReportType] = useState<'monthly' | 'daily'>('monthly');
  const [selectedDate, setSelectedDate] = useState('');

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
      `RELATÓRIO FINANCEIRO - ${headerTitle.toUpperCase()}`,
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

    doc.save(`RELATORIO_FINANCEIRO - ${headerTitle} - ${reportType === 'monthly' ? `${selectedMonth}_${selectedYear}` : selectedDate}.pdf`);
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 90vw; /* Para se ajustar em telas pequenas */
  width: 400px; /* Largura fixa para telas maiores */
  animation: fadeIn 0.3s ease;

  h2 {
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
    color: #333;
    font-size: 1.5rem; /* Aumenta o tamanho do título */
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    padding: 15px;
    width: 90%; /* Largura total em telas pequenas */
  }
`;

const Select = styled.select`
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  font-size: 1rem; /* Aumenta o tamanho da fonte */

  &:focus {
    border-color: #007BFF;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  font-size: 1rem; /* Aumenta o tamanho da fonte */

  &:focus {
    border-color: #007BFF;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  background-color: #007BFF;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 480px) {
    width: 100%; /* Botões em largura total em telas pequenas */
    margin: 5px 0; /* Margem entre os botões */
  }
`;

export default PDFModal;
