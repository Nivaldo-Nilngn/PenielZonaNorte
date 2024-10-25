import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Item } from './types/Item';
import { db, auth } from './firebaseConfig';
import { ref, onValue, remove, get } from 'firebase/database'; // Adicione a função 'get' aqui
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LoginScreen from './components/LoginScreen';
import { getCurrentMonth, filterListByMonth } from './helpers/dateFilter';
import { TableArea } from "./components/TableArea";
import { InfoArea } from './components/InfoArea';
import { InputArea } from './components/InputArea';
import Graphs from './components/Graphs';
import { categories } from './data/categories';
import PDFModal from './components/PDFModal';
import ConfirmationModal from './components/ConfirmationModal';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [list, setList] = useState<Item[]>([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [filteredList, setFilteredList] = useState<Item[]>([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [showGraphs, setShowGraphs] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.split('-')[1]);
  const [selectedYear, setSelectedYear] = useState(currentMonth.split('-')[0]);

  // Verifica se o usuário está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Obtém dados financeiros do Firebase
  useEffect(() => {
    if (isAuthenticated) {
      const itemsRef = ref(db, 'financialData');
      onValue(itemsRef, (snapshot) => {
        const data: Item[] = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          data.push({
            date: new Date(new Date(childData.date).getTime() + 3 * 60 * 60 * 1000),
            category: childData.category,
            title: childData.title,
            value: childData.value,
          });
        });
        setList(data);
      });
    }
  }, [isAuthenticated]);

  // Filtra a lista com base no mês e ano selecionados
  useEffect(() => {
    const filtered = filterListByMonth(list, `${selectedYear}-${selectedMonth}`);
    setFilteredList(filtered);
  }, [list, selectedMonth, selectedYear]);

  // Calcula a receita e a despesa totais
  useEffect(() => {
    let incomeCount = 0;
    let expenseCount = 0;

    filteredList.forEach(item => {
      const value = item.value || 0;
      const isExpense = categories[item.category]?.expense;
      if (isExpense) expenseCount += value;
      else incomeCount += value;
    });

    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [filteredList]);

  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Erro ao fazer logout:", error);
    });
  };

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
    setSelectedMonth(newMonth.split('-')[1]);
    setSelectedYear(newMonth.split('-')[0]);
  };

  const handleAddItem = (item: Item) => {
    setList(prevList => [...prevList, item]);
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setShowConfirmationModal(true);
  };

  const handleDeleteItem = async (password: string) => {
    const adminRef = ref(db, 'admin/password');
    
    // Obtenha a senha do Firebase uma única vez
    const snapshot = await get(adminRef);
    const adminPassword = snapshot.val();

    if (password === adminPassword) {
      if (itemToDelete) {
        const itemRef = ref(db, `financialData/${itemToDelete.title}`); // Verifique se 'title' é único
        try {
          await remove(itemRef);
          console.log('Item excluído com sucesso.');
          
          // Atualiza a lista local
          setList(prevList => prevList.filter(item => item.title !== itemToDelete.title));
        } catch (error) {
          console.error('Erro ao excluir item:', error);
        }
      }
    } else {
      alert("Senha incorreta. Exclusão não permitida.");
    }

    setShowConfirmationModal(false); // Fecha o modal após a verificação
    setItemToDelete(null); // Limpa o item a ser excluído
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

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
            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
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
          <TableArea list={filteredList} onDelete={handleDeleteClick} />
        )}
      </Body>

      <ConfirmationModal 
        show={showConfirmationModal} 
        onClose={() => setShowConfirmationModal(false)} 
        onConfirm={handleDeleteItem} 
      />
    </Container>
  );
};

// Estilização dos componentes
const Container = styled.div``;

const Header = styled.div`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  width: 100%;
  height: auto;
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
  background-color: #2980b9;
  color: #FFF;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #1a5276; /* Azul mais escuro ao passar o mouse */
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

const LogoutButton = styled(ToggleButton)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }

  &:active {
    background-color: #bd2130;
  }
`;

const Body = styled.div`
  padding: 20px;
`;

export default App;
