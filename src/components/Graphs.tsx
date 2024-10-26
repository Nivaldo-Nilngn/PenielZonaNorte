import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';

type Props = {
  items: Item[];
};

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

const Graphs = ({ items }: Props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const incomeData = Object.entries(categories)
    .filter(([_, category]) => !category.expense)
    .map(([key, category]) => {
      const totalValue = items
        .filter(item => item.category === key)
        .reduce((acc, item) => acc + item.value, 0);
      return { name: category.title, value: totalValue, color: category.color };
    })
    .filter(item => item.value > 0);

  const expenseData = Object.entries(categories)
    .filter(([_, category]) => category.expense)
    .map(([key, category]) => {
      const totalValue = items
        .filter(item => item.category === key)
        .reduce((acc, item) => acc + item.value, 0);
      return { name: category.title, value: totalValue, color: category.color };
    })
    .filter(item => item.value > 0);

  const handleClick = (entry: { name: string }) => {
    setSelectedItem(entry.name);
  };

  const handleClickOutside = () => {
    setSelectedItem(null);
  };

  const filteredItems = selectedItem
    ? items.filter(item => categories[item.category]?.title === selectedItem)
    : items;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  };

  const toggleChartType = () => {
    setChartType(prevType => (prevType === 'pie' ? 'bar' : 'pie'));
  };

  return (
    <Container onClick={handleClickOutside}>
      <h2>Gráficos de Gastos e Entradas</h2>

      <StyledButton onClick={toggleChartType}>
        Alternar para Gráfico {chartType === 'pie' ? 'de Barras' : 'de Pizza'}
      </StyledButton>

      <GraphsContainer>
        <GraphSection>
          <h3>Entradas</h3>
          {chartType === 'pie' ? (
            <PieChart width={320} height={320}>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `(${formatCurrency(entry.value)})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={handleClick}
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-income-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart width={320} height={320} data={incomeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-income-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </GraphSection>

        <GraphSection>
          <h3>Saídas</h3>
          {chartType === 'pie' ? (
            <PieChart width={320} height={320}>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `(${formatCurrency(entry.value)})`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={handleClick}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-expense-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <BarChart width={320} height={320} data={expenseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8">
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-expense-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </GraphSection>
      </GraphsContainer>

      {filteredItems.length > 0 && (
        <TableContainer>
          <h4>Valores {selectedItem ? `para: ${selectedItem}` : 'de todos os itens'}</h4>
          <StyledTable>
            <thead>
              <tr>
                <th>Data</th>
                <th>Categoria</th>
                <th>Título</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.date.toLocaleDateString('pt-BR')}</td>
                  <td>{categoryTranslations[item.category] || item.category}</td>
                  <td>{item.title}</td>
                  <td>{formatCurrency(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </Container>
  );
};

// Estilização
const Container = styled.div`
  margin: 20px;
  text-align: center;
`;

const StyledButton = styled.button`
  background-color: #2980b9;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #1a5276;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const GraphsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  @media(min-width: 768px) {
    flex-direction: row;
  }
`;

const GraphSection = styled.div`
  width: 100%;
  max-width: 320px;
  margin: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

export default Graphs;