import React from 'react';
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

   // Mapeamento das categorias para português
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

  // Função para gerar o PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Filtrar a lista para o mês e ano selecionados
    const filteredForSelectedMonth = filteredList.filter(item => {
      const itemDate = new Date(item.date);
      const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
      const itemYear = itemDate.getFullYear().toString();

      return itemMonth === selectedMonth && itemYear === selectedYear;
    });

    // Adicionando título centralizado
    doc.setFontSize(20);
    doc.text(
      "RELATÓRIO FINANCEIRO - IGREJA PENIEL ZONA NORTE",
      doc.internal.pageSize.getWidth() / 2,
      16,
      { align: 'center' }
    );

    // Criando tabela de entradas
    const incomeData = filteredForSelectedMonth
      .filter(item => !categories[item.category]?.expense)
      .map(item => [
        item.title,
        categoryTranslations[item.category] || item.category, // Tradução da categoria
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

    // Total de entradas
    const totalIncome = incomeData.reduce(
      (total, item) => total + Number(item[2].replace('R$ ', '').replace(',', '.')),
      0
    );
    doc.text(
      `Total de Receitas: R$ ${totalIncome.toFixed(2)}`,
      14,
      doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 30
    );

    // Criando tabela de saídas
    const expenseData = filteredForSelectedMonth
      .filter(item => categories[item.category]?.expense)
      .map(item => [
        item.title,
        categoryTranslations[item.category] || item.category, // Tradução da categoria
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

    // Total de saídas
    const totalExpense = expenseData.reduce(
      (total, item) => total + Number(item[2].replace('R$ ', '').replace(',', '.')),
      0
    );
    doc.text(
      `Total de Despesas: R$ ${totalExpense.toFixed(2)}`,
      14,
      doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 30
    );

    // Calculando o balanço
    const balance = totalIncome - totalExpense;

    // Adicionando o balanço na parte inferior da página
    const finalY = doc.internal.pageSize.getHeight() - 20;
    const balanceText = `Balanço: R$ ${balance.toFixed(2)}`;

    doc.text(balanceText, doc.internal.pageSize.getWidth() - 14, finalY, { align: 'right' });

    // Salvar o PDF
    doc.save(`relatorio_financeiro_${selectedMonth}_${selectedYear}.pdf`);
  };

  if (!show) return null;

  return (
    <Modal>
      <ModalContent>
        <h2>Selecionar Mês e Ano</h2>
        <Input
          type="month"
          value={`${selectedYear}-${selectedMonth}`}
          onChange={e => {
            const [year, month] = e.target.value.split("-");
            setSelectedYear(year);
            setSelectedMonth(month);
          }}
        />
        <Button onClick={generatePDF}>Gerar PDF</Button>
        <Button onClick={onClose}>Fechar</Button>
      </ModalContent>
    </Modal>
  );
};

// Estilização da Modal
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;

  h2 {
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #007BFF;
  color: #FFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;

export default PDFModal;
