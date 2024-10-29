import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Item } from './types/Item';
import { db, auth } from './firebaseConfig';
import { ref, onValue, remove, get } from 'firebase/database';
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
import logo from './assets/logoBranco.png';

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [dbName, setDbName] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      if (user) {
        localStorage.setItem("uid", user.uid);
        fetchDatabaseName(user.uid);
      } else {
        localStorage.removeItem("uid");
        setDbName('');
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchDatabaseName = (uid: string) => {
    const databaseNames = ['PenielZonaNote', 'PenielIbura', 'PenielIpsep'];
    const churchNames = {
      PenielZonaNote: 'IGREJA PENIEL ZONA NORTE',
      PenielIbura: 'IGREJA PENIEL IBURA',
      PenielIpsep: 'IGREJA PENIEL IPSEP',
    };

    databaseNames.forEach(dbName => {
      const usersRef = ref(db, `${dbName}/usuarios`);
      onValue(usersRef, snapshot => {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.key === uid) {
            setDbName(dbName);
            setHeaderText(churchNames[dbName as keyof typeof churchNames]);
          }
        });
      });
    });
  };

  const fetchData = useCallback(async (uid: string) => {
    setLoading(true);
    const itemsRef = ref(db, `${dbName}`);
    onValue(itemsRef, snapshot => {
      const data: Item[] = [];
      snapshot.forEach(childSnapshot => {
        const childData = childSnapshot.val();
        data.push({
          id: childSnapshot.key!,
          date: new Date(new Date(childData.date).getTime() + 3 * 60 * 60 * 1000),
          category: childData.category,
          title: childData.title,
          value: parseFloat(childData.value),
        });
      });
      setList(data);
      setLoading(false);
    }, { onlyOnce: true });
  }, [dbName]);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid && dbName) {
      fetchData(uid);
    }
  }, [dbName, fetchData]);

  useEffect(() => {
    const filtered = filterListByMonth(list, `${selectedYear}-${selectedMonth}`);
    setFilteredList(filtered);
  }, [list, selectedMonth, selectedYear]);

  useEffect(() => {
    const incomeCount = filteredList.reduce((sum, item) => {
      return sum + (categories[item.category]?.expense ? 0 : item.value || 0);
    }, 0);
    const expenseCount = filteredList.reduce((sum, item) => {
      return sum + (categories[item.category]?.expense ? item.value || 0 : 0);
    }, 0);
    setIncome(incomeCount);
    setExpense(expenseCount);
  }, [filteredList]);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Erro ao fazer logout:", error));
  };

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
    setSelectedMonth(newMonth.split('-')[1]);
    setSelectedYear(newMonth.split('-')[0]);
  };

  const handleAddItem = (item: Item) => {
    setList(prevList => [...prevList, item]);
  };

  const handleDeleteClick = (item: Item) => {
    setItemToDelete(item);
    setShowConfirmationModal(true);
  };

  const handleDeleteItem = async (password: string) => {
    if (!dbName || !itemToDelete) return;

    const adminRef = ref(db, `${dbName}/admin/password`);
    const snapshot = await get(adminRef);
    const adminPassword = snapshot.val();

    if (password === adminPassword) {
      const itemRef = ref(db, `${dbName}/${itemToDelete.id}`);
      try {
        await remove(itemRef);
        setList(prevList => prevList.filter(item => item.id !== itemToDelete.id));
        console.log('Item excluído com sucesso.');
      } catch (error) {
        console.error('Erro ao excluir item:', error);
      }
    } else {
      alert("Senha incorreta. Exclusão não permitida.");
    }

    setShowConfirmationModal(false);
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Atualiza o estado para fechar o modal
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Carregando dados...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Logo src={logo} alt="Logo" />
          <HeaderText>{headerText || 'IGREJA PENIEL'}</HeaderText> {/* Usa o headerText dinâmico */}
        </HeaderContent>
        <ButtonsWrapper>
          <ToggleButton onClick={() => setShowGraphs(!showGraphs)}>
            {showGraphs ? "Voltar" : "Ver Gráficos"}
          </ToggleButton>
          <ToggleButton onClick={() => setShowModal(true)}>
            Gerar PDF
          </ToggleButton>
          <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
        </ButtonsWrapper>
      </Header>

      <PDFModal
  show={showModal}
  onClose={handleCloseModal}
  filteredList={filteredList}
  selectedMonth={selectedMonth}
  selectedYear={selectedYear}
  setSelectedMonth={setSelectedMonth}
  setSelectedYear={setSelectedYear}
  headerTitle={headerText} // Passando o título do header

/>



      <Body>
        <InfoArea
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
          income={income}
          expense={expense}
        />
       <InputArea onAdd={handleAddItem} dbName={dbName} />
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const LoadingText = styled.h2`
  font-size: 24px;
  color: #333;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const HeaderText = styled.h1`
  margin: 0;
  padding: 0;
  color: #FFF;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
    display: none;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;

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
    background-color: #1a5276;
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
