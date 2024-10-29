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
  const [reportType, setReportType] = useState<'monthly' | 'daily' | 'weekly'>('monthly');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');

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
    let filteredItems: any[] = [];

    if (reportType === 'monthly') {
      filteredItems = filteredList.filter(item => {
        const itemDate = new Date(item.date);
        const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
        const itemYear = itemDate.getFullYear().toString();
        return itemMonth === selectedMonth && itemYear === selectedYear;
      });
    } else if (reportType === 'daily') {
      filteredItems = filteredList.filter(item =>
        new Date(item.date).toISOString().split('T')[0] === selectedDate
      );
    } else if (reportType === 'weekly') {
      const [year, week] = selectedWeek.split('-W');
      filteredItems = filteredList.filter(item => {
        const itemDate = new Date(item.date);
        const itemWeek = Math.ceil(
          (itemDate.getDate() - itemDate.getDay() + 10) / 7
        );
        return itemDate.getFullYear().toString() === year && itemWeek === parseInt(week);
      });
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
      theme: 'striped',
    });

    const totalIncome = incomeData.reduce(
      (total, item) => total + Number(item[2].replace('R$ ', '').replace(',', '.')),
      0
    );
    doc.text(`Total de Receitas: R$ ${totalIncome.toFixed(2)}`, 14, doc.previousAutoTable.finalY + 10);

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
      startY: doc.previousAutoTable.finalY + 30,
      theme: 'grid',
      headStyles: { fillColor: [255, 0, 0] },
    });

    const totalExpense = expenseData.reduce(
      (total, item) => total + Number(item[2].replace('R$ ', '').replace(',', '.')),
      0
    );
    doc.text(`Total de Despesas: R$ ${totalExpense.toFixed(2)}`, 14, doc.previousAutoTable.finalY + 10);

    const balance = totalIncome - totalExpense;
    const finalY = doc.internal.pageSize.getHeight() - 20;
    doc.text(`Balanço: R$ ${balance.toFixed(2)}`, doc.internal.pageSize.getWidth() - 14, finalY, { align: 'right' });

    doc.save(`relatorio_financeiro_${reportType}_${selectedWeek || selectedDate}.pdf`);
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <h2>Gerar Relatório</h2>
        <Select onChange={e => setReportType(e.target.value as 'monthly' | 'daily' | 'weekly')}>
          <option value="monthly">Mensal</option>
          <option value="daily">Diário</option>
          <option value="weekly">Semanal</option>
        </Select>
        {reportType === 'monthly' ? (
          <Input type="month" value={`${selectedYear}-${selectedMonth}`} onChange={e => {
            const [year, month] = e.target.value.split("-");
            setSelectedYear(year);
            setSelectedMonth(month);
          }} />
        ) : reportType === 'daily' ? (
          <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        ) : (
          <Input type="week" value={selectedWeek} onChange={e => setSelectedWeek(e.target.value)} />
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #f9f9f9;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  text-align: center;

  h2 {
    color: #333;
    font-size: 1.6em;
    margin-bottom: 20px;
  }
`;

const Select = styled.select`
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 12px 25px;
  margin: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #388e3c;
  }
`;

export default PDFModal;