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
  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [selectedDate, setSelectedDate] = useState('');
  
  const categoryTranslations = {
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
    } else if (reportType === 'weekly') {
      // Define the date range for the week here based on selectedDate
      // Assuming selectedDate is the start of the week
      const startDate = new Date(selectedDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      filteredItems = filteredList.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    } else {
      filteredItems = filteredList.filter(item => 
        new Date(item.date).toISOString().split('T')[0] === selectedDate
      );
    }

    doc.setFontSize(20);
    doc.text(
      "RELATÓRIO FINANCEIRO - IGREJA PENIEL ZONA NORTE",
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

    doc.save(`relatorio_financeiro_${reportType}_${reportType === 'weekly' ? `semana_${selectedDate}` : (reportType === 'monthly' ? `${selectedMonth}_${selectedYear}` : selectedDate)}.pdf`);
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <h2>Selecionar Tipo de Relatório</h2>
        <Select onChange={e => setReportType(e.target.value as 'monthly' | 'weekly' | 'daily')}>
          <option value="monthly">Mensal</option>
          <option value="weekly">Semanal</option>
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
        <ButtonContainer>
          <Button onClick={generatePDF}>Gerar PDF</Button>
          <Button onClick={onClose}>Fechar</Button>
        </ButtonContainer>
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  max-width: 450px;
  width: 90%;
  text-align: center;
  
  h2 {
    color: #333;
    margin-bottom: 24px;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007BFF;
  color: #FFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;

export default PDFModal;