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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    } else if (reportType === 'daily') {
      filteredItems = filteredList.filter(item => item.date === selectedDate);
    } else {
      filteredItems = filteredList.filter(item => 
        new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
      );
    }

    doc.setFontSize(20);
    doc.text(
      "RELATÓRIO FINANCEIRO - IGREJA PENIEL ZONA NORTE",
      doc.internal.pageSize.getWidth() / 2,
      16,
      { align: 'center' }
    );

    // Tabelas e cálculos de totais (Entradas e Saídas)
    doc.autoTable({
      head: [['Data', 'Categoria', 'Descrição', 'Valor']],
      body: filteredItems.map(item => [
        item.date,
        categoryTranslations[item.category] || item.category,
        item.description,
        `R$ ${item.value.toFixed(2)}`,
      ]),
      startY: 30,
    });

    // Totalizadores de entradas e saídas
    const totalIncome = filteredItems
      .filter(item => item.value > 0)
      .reduce((acc, item) => acc + item.value, 0);
    const totalExpenses = filteredItems
      .filter(item => item.value < 0)
      .reduce((acc, item) => acc + Math.abs(item.value), 0);

    doc.text(`Total de Entradas: R$ ${totalIncome.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total de Saídas: R$ ${totalExpenses.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);

    doc.save(`relatorio_financeiro_${reportType}_${reportType === 'weekly' ? `${startDate}_${endDate}` : ''}.pdf`);
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <Title>Selecionar Tipo de Relatório</Title>
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
          <>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Data de início" />
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="Data de término" />
          </>
        )}

        <Button onClick={generatePDF}>Gerar PDF</Button>
        <CloseButton onClick={onClose}>Fechar</CloseButton>
      </ModalContent>
    </Modal>
  );
};

// Estilização da modal com aparência moderna
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
  animation: fadeIn 0.3s ease;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 90%;
  max-width: 500px;
  animation: slideUp 0.3s ease;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #007BFF;
`;

const Select = styled.select`
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #007BFF;
  color: #FFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CloseButton = styled(Button)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }
`;

export default PDFModal;