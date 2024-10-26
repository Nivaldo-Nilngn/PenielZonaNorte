import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';

type Props = {
  items: Item[];
};

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

const Graphs = ({ items }: Props) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie'); // Estado para o tipo de gráfico

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
    setSelectedItem(null); // Reseta a seleção ao clicar fora
  };

  const filteredItems = selectedItem
    ? items.filter(item => categories[item.category]?.title === selectedItem)
    : items; // Mostra todos os itens quando nenhum está selecionado

  // Função para formatar valores em reais
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  };

  // Função para alternar o tipo de gráfico
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
            <PieChart width={400} height={400}>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `(${formatCurrency(entry.value)})`} // Formatação do rótulo
                outerRadius={100}  // Ajuste do tamanho
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
            <BarChart width={400} height={400} data={incomeData}>
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
            <PieChart width={400} height={400}>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={entry => `(${formatCurrency(entry.value)})`} // Formatação do rótulo
                outerRadius={100}  // Ajuste do tamanho
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
            <BarChart width={400} height={400} data={expenseData}>
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
  text-align: center;  // Centraliza os gráficos
`;

const StyledButton = styled.button`
  background-color: #2980b9;
  color: white; /* Cor do texto */
  border: none; /* Remove a borda */
  border-radius: 5px; /* Bordas arredondadas */
  padding: 10px 20px; /* Espaçamento interno */
  font-size: 16px; /* Tamanho da fonte */
  cursor: pointer; /* Cursor pointer ao passar o mouse */

  /* Efeito de hover */
  &:hover {
    background-color: #1a5276;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const GraphsContainer = styled.div`
  display: flex;
  justify-content: center;  // Centraliza os gráficos no desktop
  flex-direction: column;   // No mobile, empilha os gráficos
  align-items: center; // Centraliza verticalmente
  @media(min-width: 768px) {
    flex-direction: row;  // No desktop, exibe os gráficos lado a lado
  }
`;

const GraphSection = styled.div`
  width: 100%;
  max-width: 400px;  // Limita o tamanho máximo do gráfico
  margin: 20px;  // Centraliza os gráficos sem usar auto
  text-align: center;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  width: 100%; // Permite que a tabela ocupe a largura total
  max-width: 600px; // Limita a largura máxima da tabela
  margin-left: auto; // Centraliza horizontalmente
  margin-right: auto; // Centraliza horizontalmente
  display: flex; // Adicione isso para garantir que a tabela ocupe espaço
  justify-content: center; // Centraliza a tabela
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