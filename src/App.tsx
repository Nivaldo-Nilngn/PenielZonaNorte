import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Item } from './types/Item';
import { db, auth } from './firebaseConfig';
import { ref, onValue, remove, get, set } from 'firebase/database';
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
  // Estados de controle
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
  // Estado para controle de acesso ao botão "Igrejas"
  const [isAdmin, setIsAdmin] = useState(false);
  // Estado para armazenar a igreja (base de dados) atual em que o UID está cadastrado (na área admin/usuarios)
  const [selectedChurch, setSelectedChurch] = useState('');
  // Estado para exibir o painel de seleção de igreja
  const [showChurchSelection, setShowChurchSelection] = useState(false);

  // Array das igrejas disponíveis para troca (sem o "Teste")
  const databaseNames = ['PenielZonaNote', 'PenielIbura', 'PenielIpsep'];
  const churchNames: { [key: string]: string } = {
    PenielZonaNote: 'IGREJA PENIEL ZONA NORTE',
    PenielIbura: 'IGREJA PENIEL IBURA',
    PenielIpsep: 'IGREJA PENIEL IPSEP'
  };




  // Função para trocar de igreja
  const changeChurch = async (newChurch: string) => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    // Se o usuário já estiver cadastrado em uma igreja, removê-lo da atual
    if (selectedChurch) {
      const oldChurchRef = ref(db, `${selectedChurch}/usuarios/${uid}`);
      try {
        await remove(oldChurchRef);
      } catch (error) {
        console.error("Erro ao remover UID da igreja atual:", error);
      }
    }

    // Adicionar o UID à nova igreja (na área admin/usuarios)
    const newChurchRef = ref(db, `${newChurch}/usuarios/${uid}`);
    try {
      await set(newChurchRef, true);
      console.log(`UID adicionado na igreja ${newChurch}`);
    } catch (error) {
      console.error("Erro ao adicionar UID na nova igreja:", error);
    }

    // Atualiza o estado e recarrega a página para refletir as mudanças
    setSelectedChurch(newChurch);
    window.location.reload();
  };

  // Função para buscar o nome do banco de dados (para exibição de dados e cabeçalho)
  const fetchDatabaseName = useCallback((uid: string) => {
    const churchNamesForHeader = {
      PenielZonaNote: 'IGREJA PENIEL ZONA NORTE',
      PenielIbura: 'IGREJA PENIEL IBURA',
      PenielIpsep: 'IGREJA PENIEL IPSEP'
    };

    databaseNames.forEach(dbNameItem => {
      const usersRef = ref(db, `${dbNameItem}/usuarios`);
      onValue(usersRef, snapshot => {
        snapshot.forEach(childSnapshot => {
          if (childSnapshot.key === uid) {
            setDbName(dbNameItem);
            setHeaderText(churchNamesForHeader[dbNameItem as keyof typeof churchNamesForHeader]);
          }
        });
      });
    });
  }, [databaseNames]); // ✅ Corrigido: `databaseNames` usado corretamente como dependência

  // Função para buscar em qual igreja o UID está cadastrado na área admin/usuarios
  const fetchCurrentChurchAdmin = useCallback(async (uid: string) => {
    for (const church of databaseNames) {
      const churchAdminRef = ref(db, `${church}/usuarios/${uid}`);
      try {
        const snapshot = await get(churchAdminRef);
        if (snapshot.exists() && snapshot.val() === true) {
          setSelectedChurch(church);
          return;
        }
      } catch (error) {
        console.error("Erro ao buscar igreja atual:", error);
      }
    }
  }, [databaseNames]); // ✅ Certifique-se de incluir `databaseNames` como dependência

  // Função para buscar dados do banco de dados
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
  }, [dbName]); // ✅ Adicionado `dbName` corretamente



  // Monitoramento da autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      if (user) {
        localStorage.setItem("uid", user.uid);
        fetchDatabaseName(user.uid);

        const adminRef = ref(db, `Admin/usuarios/${user.uid}`);
        get(adminRef).then(snapshot => {
          setIsAdmin(snapshot.exists() && snapshot.val() === true);
        }).catch(error => {
          console.error("Erro ao verificar acesso admin:", error);
          setIsAdmin(false);
        });

        fetchCurrentChurchAdmin(user.uid);
      } else {
        localStorage.removeItem("uid");
        setDbName('');
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, [fetchCurrentChurchAdmin, fetchDatabaseName]);

  // Quando houver mudança no dbName, busca os dados
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid && dbName && isAuthenticated) {
      fetchData(uid);
    }
  }, [dbName, isAuthenticated, fetchData]);


  // Filtra a lista com base no mês/ano selecionados
  useEffect(() => {
    const filtered = filterListByMonth(list, `${selectedYear}-${selectedMonth}`);
    setFilteredList(filtered);
  }, [list, selectedMonth, selectedYear]);

  // Calcula receitas e despesas
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
    setShowModal(false); // Fecha o modal de PDF
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
      <HeaderStyled>
        <HeaderContentStyled>
          <LogoStyled src={logo} alt="Logo" />
          <HeaderTextStyled>{headerText || 'IGREJA PENIEL'}</HeaderTextStyled>
        </HeaderContentStyled>
        <ButtonsWrapperStyled>
          <ToggleButtonStyled onClick={() => setShowGraphs(!showGraphs)}>
            {showGraphs ? "Voltar" : "Ver Gráficos"}
          </ToggleButtonStyled>
          <ToggleButtonStyled onClick={() => setShowModal(true)}>
            Gerar PDF
          </ToggleButtonStyled>
          {/* Botão "Igrejas" visível somente para administradores */}
          {isAdmin && (
            <ToggleButtonStyled onClick={() => setShowChurchSelection(!showChurchSelection)}>
              Igrejas
            </ToggleButtonStyled>
          )}
          <LogoutButtonStyled onClick={handleLogout}>Sair</LogoutButtonStyled>
        </ButtonsWrapperStyled>
      </HeaderStyled>

      {/* Painel de seleção de igreja */}
      {showChurchSelection && (
        <ChurchSelectionContainer>
          <SelectionTitle>Selecione a Igreja:</SelectionTitle>
          <CurrentChurch>
            Igreja Atual: {selectedChurch ? churchNames[selectedChurch] : "Nenhuma"}
          </CurrentChurch>
          {databaseNames.map(church => (
            <ChurchButton
              key={church}
              onClick={() => changeChurch(church)}
              disabled={selectedChurch === church}
            >
              {churchNames[church]}
            </ChurchButton>
          ))}
        </ChurchSelectionContainer>
      )}

      <PDFModal
        show={showModal}
        onClose={handleCloseModal}
        filteredList={filteredList}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        headerTitle={headerText} // Título dinâmico do cabeçalho
      />

      <BodyStyled>
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
      </BodyStyled>

      <ConfirmationModal
        show={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleDeleteItem}
      />
    </Container>
  );
};

// Estilização dos componentes com styled-components
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

// Estilização do cabeçalho
const HeaderStyled = styled.div`
  background: linear-gradient(135deg, #2c3e50, #34495e);
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const HeaderContentStyled = styled.div`
  display: flex;
  align-items: center;
`;

const LogoStyled = styled.img`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const HeaderTextStyled = styled.h1`
  margin: 0;
  padding: 0;
  color: #FFF;
  font-size: 28px;

  @media (max-width: 768px) {
    font-size: 24px;
    display: none;
  }
`;

const ButtonsWrapperStyled = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ToggleButtonStyled = styled.button`
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

const LogoutButtonStyled = styled(ToggleButtonStyled)`
  background-color: #dc3545;

  &:hover {
    background-color: #c82333;
  }

  &:active {
    background-color: #bd2130;
  }
`;

const BodyStyled = styled.div`
  padding: 20px;
`;

/* Estilização do painel de seleção de igreja */
const ChurchSelectionContainer = styled.div`
  background: #f1f1f1;
  padding: 15px;
  margin: 10px 20px;
  border-radius: 5px;
  text-align: center;
`;

const SelectionTitle = styled.h3`
  margin-bottom: 10px;
`;

const CurrentChurch = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ChurchButton = styled.button`
  margin: 5px;
  padding: 8px 16px;
  background-color: #2980b9;
  color: #FFF;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export default App;
