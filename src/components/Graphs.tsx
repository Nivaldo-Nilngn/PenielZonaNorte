import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Dot,
} from 'recharts';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';

type Props = {
  items: Item[];
};

// Definindo os tipos para entrada e saída
interface ChartData {
  name: string;
  value: number;
  color: string;
  type: 'Entrada' | 'Saída';
}

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
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'column' | 'line'>('pie');

  // Dados de entradas e saídas
  const incomeData: ChartData[] = items
    .filter(item => !categories[item.category]?.expense)
    .map(item => ({
      name: categoryTranslations[item.category] || item.category,
      value: item.value,
      color: categories[item.category]?.color || '#2980b9',
      type: 'Entrada' // Tipo para legendas
    }));

  const expenseData: ChartData[] = items
    .filter(item => categories[item.category]?.expense)
    .map(item => ({
      name: categoryTranslations[item.category] || item.category,
      value: item.value,
      color: categories[item.category]?.color || '#c0392b',
      type: 'Saída' // Tipo para legendas
    }));

  // Combina dados de entradas e saídas, assegurando que cada categoria tenha uma única entrada
  const combinedData: ChartData[] = [...incomeData, ...expenseData];
  const uniqueData: ChartData[] = combinedData.reduce((acc: ChartData[], current: ChartData) => {
    const existing = acc.find(item => item.name === current.name);
    if (existing) {
      existing.value += current.value; // Soma os valores se a categoria já existir
    } else {
      acc.push(current); // Adiciona nova categoria
    }
    return acc;
  }, []);

  const handleClick = (data: ChartData) => {
    const index = items.findIndex(item => item.title === data.name && item.value === data.value);
    if (index !== -1) {
      setSelectedItemIndex(index);
    }
  };

  // Função para renderizar um dot personalizado
  const renderCustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <Dot
        cx={cx}
        cy={cy}
        onClick={() => handleClick(payload)}
        stroke="blue"
        strokeWidth={2}
        fill="white"
        r={5} // Tamanho do dot
      />
    );
  };

  return (
    <Container>
      <h2>Gráficos de Entradas e Saídas</h2>

      <ButtonContainer>
        <Button onClick={() => setChartType('pie')}>Pizza</Button>
        <Button onClick={() => setChartType('column')}>Coluna</Button>
        <Button onClick={() => setChartType('line')}>Linha</Button>
      </ButtonContainer>

      <GraphsContainer>
        <GraphSection>
          <h3>Entradas e Saídas</h3>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={uniqueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                  outerRadius="80%"
                  dataKey="value"
                >
                  {uniqueData.map((entry: ChartData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#ddd'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            ) : chartType === 'column' ? (
              <BarChart data={uniqueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="value" fill="#2980b9" onClick={handleClick} />
              </BarChart>
            ) : (
              <LineChart data={uniqueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2980b9"
                  strokeWidth={2}
                  dot={renderCustomDot} // Usando o dot personalizado
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </GraphSection>
      </GraphsContainer>

      {/* Tabela de informações */}
      <TableContainer>
        <h4>Valores de todos os itens</h4>
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
            {items.map((item, index) => (
              <TableRow key={index} selected={index === selectedItemIndex}>
                <td>{item.date.toLocaleDateString('pt-BR')}</td>
                <td>{categoryTranslations[item.category] || item.category}</td>
                <td>{item.title}</td>
                <td>R$ {item.value.toFixed(2)}</td>
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>
    </Container>
  );
};

// Estilização
const Container = styled.div`
  margin: 20px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #2980b9;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #1a5276;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const GraphsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GraphSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TableContainer = styled.div`
  margin-top: 20px;
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
    color: #333;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #e0f7fa;
  }
`;

const TableRow = styled.tr<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? '#e0f7fa' : 'transparent')};
`;

export default Graphs;
