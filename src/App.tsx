import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Item } from './types/Item';
import { db } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { getCurrentMonth, filterListByMonth } from './helpers/dateFilter';
import { TableArea } from "./components/TableArea";
import { InfoArea } from './components/InfoArea';
import { InputArea } from './components/InputArea';
import Graphs from './components/Graphs'; 
import { categories } from './data/categories'; 
import PDFModal from './components/PDFModal';

const App = () => {
  const [list, setList] = useState<Item[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [showGraphs, setShowGraphs] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.split('-')[1]); // Mês atual
  const [selectedYear, setSelectedYear] = useState(currentMonth.split('-')[0]); // Ano atual

  // Função para carregar os dados do Firebase
  useEffect(() => {
    const itemsRef = ref(db, 'financialData');
    
    onValue(itemsRef, (snapshot) => {
        const data: Item[] = [];
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            data.push({
              date: new Date(new Date(childData.date).getTime() + 3 * 60 * 60 * 1000), // Adiciona 3 horas
              category: childData.category,
              title: childData.title,
              value: childData.value,
          });
          
        });
        setList(data);
        console.log("Dados carregados:", data);
    });
  }, []);

  // Filtrar a lista com base no mês e ano selecionados
  useEffect(() => {
    const filtered = filterListByMonth(list, `${selectedYear}-${selectedMonth}`);
    setFilteredList(filtered); // Somente filtra os dados
  }, [list, selectedMonth, selectedYear]);

  // Calcular a renda e a despesa totais
  useEffect(() => {
    let incomeCount = 0;
    let expenseCount = 0;

    for (let i in filteredList) {
      const value = filteredList[i].value || 0;
      const isExpense = categories[filteredList[i].category]?.expense;

      if (isExpense) {
        expenseCount += value;
      } else {
        incomeCount += value;
      }
    }

    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [filteredList]);

  // Função para mudar o mês sem modificar ou salvar dados
  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
    setSelectedMonth(newMonth.split('-')[1]); // Atualiza o mês selecionado
    setSelectedYear(newMonth.split('-')[0]); // Atualiza o ano selecionado
  };

  // Função para adicionar novos itens manualmente
  const handleAddItem = (item: Item) => {
    let newList = [...list, item];
    setList(newList);

    // Lógica para salvar no Firebase
  };
// Função para editar um item
const handleEditItem = (updatedItem: Item) => {
  const newList = list.map(item => 
    item.title === updatedItem.title ? updatedItem : item
  );
  setList(newList);

  // Lógica para atualizar no Firebase se necessário
};

// Função para excluir um item
const handleDeleteItem = (itemToDelete: Item) => {
  const newList = list.filter(item => item.title !== itemToDelete.title);
  setList(newList);

  // Lógica para excluir no Firebase se necessário
};
  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderText>Igreja Peniel Zona Norte</HeaderText>
          <ButtonsWrapper>
            <ToggleButton onClick={() => setShowGraphs(!showGraphs)}>
              {showGraphs ? "Voltar" : "Ver Gráficos"}
            </ToggleButton>
            <ToggleButton onClick={() => setShowModal(true)}>
              Gerar PDF
            </ToggleButton>
          </ButtonsWrapper>
        </HeaderContent>
      </Header>

      <PDFModal
        show={showModal}
        onClose={() => setShowModal(false)}
        filteredList={filteredList} 
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
      />

      <Body>
        <InfoArea
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
          income={income}
          expense={expense}
        />
        <InputArea onAdd={handleAddItem} />
        {showGraphs ? (
          <Graphs items={filteredList} />
        ) : (
          <TableArea 
            list={filteredList} 
            onEdit={handleEditItem} // Passando a função de edição
            onDelete={handleDeleteItem} // Passando a função de exclusão
          />
        )}
      </Body>
    </Container>
  );
};

// Componentes Styled
const Container = styled.div``;

const Header = styled.div`
  background-color: darkblue;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeaderText = styled.h1`
  margin: 0;
  padding: 0;
  color: #FFF;
  text-align: center;
  padding-top: 10px;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  margin-right: 10px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: #FFF;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #004085;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 16px;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const Body = styled.div`
  margin: auto;
  max-width: 980px;
  margin-bottom: 50px;
`;

export default App;
