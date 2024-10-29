import { useState } from 'react';
import { Item } from '../types/Item';
import { categories } from '../data/categories';
import styled from 'styled-components';
import { db } from '../firebaseConfig'; // Importa o Realtime Database
import { ref, push, get } from 'firebase/database'; // Funções para salvar e buscar dados no Realtime Database
import { v4 as uuidv4 } from 'uuid';

type Props = {
  onAdd: (item: Item) => void;
  dbName: string; // Adicione esta linha
};

const InputArea = ({ onAdd }: Props) => {
  const [dateField, setDateField] = useState('');
  const [categoryField, setCategoryField] = useState('');
  const [titleField, setTitleField] = useState('');
  const [valueField, setValueField] = useState(0);

  let categoryKeys: string[] = Object.keys(categories);

  // Função para salvar no Realtime Database
  const saveToRealtimeDatabase = async (item: Item) => {
    const uid = localStorage.getItem('uid'); // Recupera o UID do localStorage
    if (!uid) {
      console.error("UID não encontrado.");
      return;
    }

    // Nomes dos bancos de dados
    const dbNames = ['PenielZonaNote', 'PenielIbura', 'PenielIpsep'];
    let userDatabase: string | null = null;

    // Verifica em qual banco de dados o UID pertence
    for (const dbName of dbNames) {
      const dbRef = ref(db, `${dbName}/usuarios/${uid}`);
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        userDatabase = dbName; // Banco de dados correspondente encontrado
        break;
      }
    }

    if (!userDatabase) {
      console.error("Banco de dados correspondente ao UID não encontrado.");
      return;
    }

    const itemRef = ref(db, userDatabase); // Define o caminho usando o banco de dados correspondente
    const itemWithDate = {
      ...item,
      date: new Date(item.date).toISOString(), // Armazena a data em formato ISO
    };

    try {
      await push(itemRef, itemWithDate); // Salva o item diretamente no banco de dados
      console.log("Lançamento salvo no Realtime Database");
    } catch (error) {
      console.error("Erro ao salvar no Realtime Database: ", error);
    }
  };

  const handleAddEvent = () => {
    let errors: string[] = [];

    // Validação dos campos de entrada
    if (isNaN(new Date(dateField).getTime())) {
      errors.push('Data inválida!');
    }
    if (!categoryKeys.includes(categoryField)) {
      errors.push('Categoria inválida!');
    }
    if (titleField === '') {
      errors.push('Título vazio!');
    }
    if (valueField <= 0) {
      errors.push('Valor inválido!');
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
    } else {
      const newItem: Item = {
        id: uuidv4(), // Gera um ID único
        date: new Date(new Date(dateField).getTime() + 3 * 60 * 60 * 1000),
        category: categoryField,
        title: titleField,
        value: valueField,
      };

      onAdd(newItem); // Atualiza a UI local
      saveToRealtimeDatabase(newItem); // Salva no Realtime Database
      clearFields();
    }
  };

  const clearFields = () => {
    setDateField('');
    setCategoryField('');
    setTitleField('');
    setValueField(0);
  };


  return (
    <Container>
      <InputLabel>
        <InputTitle>Data</InputTitle>
        <Input type='date' value={dateField} onChange={e => setDateField(e.target.value)} />
      </InputLabel>
      <InputLabel>
        <InputTitle>Categoria</InputTitle>
        <Select value={categoryField} onChange={e => setCategoryField(e.target.value)}>
          <option value="">Selecione uma categoria</option>
          {categoryKeys.map((key, index) => {
            const category = categories[key];
            const color = category.expense ? 'red' : 'green';
            return (
              <option key={index} value={key} style={{ color }}>
                {category.title}
              </option>
            );
          })}
        </Select>
      </InputLabel>
      <InputLabel>
        <InputTitle>Título</InputTitle>
        <Input type='text' value={titleField} onChange={e => setTitleField(e.target.value)} />
      </InputLabel>
      <InputLabel>
        <InputTitle>Valor</InputTitle>
        <Input
          type='number'
          value={valueField > 0 ? valueField : ''} // Display an empty string when valueField is 0
          onChange={e => setValueField(Number(e.target.value))} // Converte o valor para número
          placeholder=" Digite o valor" // Set placeholder text
        />
      </InputLabel>

      <InputLabel>
        <InputTitle>&nbsp;</InputTitle>
        <Button onClick={handleAddEvent}>Adicionar</Button>
      </InputLabel>
    </Container>
  );
};

// Estilização dos componentes
const InputTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #2c3e50; /* Cor do título */
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 1px;
  border: 1px solid #2980b9;
  background-color: #f0f8ff;
  border-radius: 8px;
  font-size: 16px;
  transition: border 0.3s;
  
  &:focus {
    border-color: #1a5276;
    box-shadow: 0 0 5px rgba(0, 139, 200, 0.5);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 43px;
  padding: 0 10px;
  border: 1px solid #2980b9;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f0f8ff;
  transition: border 0.3s;

  &:focus {
    border-color: #1a5276;
    outline: none;
  }
`;

const Container = styled.div`
  background-color: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputLabel = styled.label`
  flex: 1;
  margin: 10px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 5px 0;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 40px;
  padding: 0 5px;
  border: none;
  border-radius: 8px;
  background-color: #2980b9;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #1a5276;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    height: 45px;
  }
`;

// Export the InputArea component
export { InputArea };