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

interface ChartData {
  name: string;
  value: number;
  color: string;
  type: 'Entrada' | 'Saída';
}

// Category translations
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
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  const incomeData: ChartData[] = items
    .filter(item => !categories[item.category]?.expense)
    .map(item => ({
      name: categoryTranslations[item.category] || item.category,
      value: item.value,
      color: categories[item.category]?.color || '#2980b9',
      type: 'Entrada'
    }));

  const expenseData: ChartData[] = items
    .filter(item => categories[item.category]?.expense)
    .map(item => ({
      name: categoryTranslations[item.category] || item.category,
      value: item.value,
      color: categories[item.category]?.color || '#c0392b',
      type: 'Saída'
    }));

  const combinedData: ChartData[] = [...incomeData, ...expenseData];
  const uniqueData: ChartData[] = combinedData.reduce((acc: ChartData[], current: ChartData) => {
    const existing = acc.find(item => item.name === current.name);
    if (existing) {
      existing.value += current.value;
    } else {
      acc.push(current);
    }
    return acc;
  }, []);

  const handleClick = (data: ChartData) => {
    const index = items.findIndex(item => item.title === data.name && item.value === data.value);
    if (index !== -1) {
      setSelectedItemIndex(index);
    }
  };

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
        r={5}
      />
    );
  };

  // Filter items based on selected date and showAll state
  const filteredItems = showAll
    ? items 
    : selectedDate
      ? items.filter(item => item.date.toISOString().slice(0, 10) === selectedDate)
      : items;

  // Calculate total value
  const totalValue = filteredItems.reduce((total, item) => total + item.value, 0);

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
                  dot={renderCustomDot}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </GraphSection>
      </GraphsContainer>

      <TableContainer>
        <h4>Valores de todos os itens</h4>
        <InputContainer>
          <DateInput
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setShowAll(false);
            }}
          />
          <Button onClick={() => {
            setShowAll(!showAll);
            setSelectedDate('');
          }}>
            {showAll ? 'Mostrar Todos' : 'Mostrar Todos'}
          </Button>
        </InputContainer>
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
              <TableRow
                key={index}
                selected={index === selectedItemIndex}
                isExpense={categories[item.category]?.expense}
              >
                <td>{item.date.toLocaleDateString('pt-BR')}</td>
                <td>{categoryTranslations[item.category] || item.category}</td>
                <td>{item.title}</td>
                <td>R$ {item.value.toFixed(2)}</td>
              </TableRow>
            ))}
            <TotalRow>
              <td colSpan={3} style={{ textAlign: 'right' }}>Total:</td>
              <td>R$ {totalValue.toFixed(2)}</td>
            </TotalRow>
          </tbody>
        </StyledTable>
      </TableContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 20px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  color: #2c3e50;
`;

const ButtonContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s;

  &:hover {
    background-color: #2980b9;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const GraphsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 600px) {
    /* Stack elements on mobile */
    flex-direction: column;
  }
`;

const GraphSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
`;

const TableContainer = styled.div`
  margin-top: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    flex-direction: column; /* Stack inputs on mobile */
    align-items: center;
  }
`;

const DateInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }

  th {
    background-color: #3498db;
    color: white;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const TableRow = styled.tr<{ selected: boolean; isExpense: boolean }>`
  background-color: ${({ selected }) => (selected ? '#ecf0f1' : 'white')};
  color: ${({ isExpense }) => (isExpense ? '#c0392b' : '#2980b9')};
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ecf0f1;
  }
`;

const TotalRow = styled.tr`
  font-weight: bold;
  background-color: #ecf0f1;
`;

export default Graphs;
