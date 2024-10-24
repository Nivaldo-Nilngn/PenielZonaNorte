// src/services/firestoreService.js
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Função para adicionar lançamento
export const addLancamento = async (lancamento) => {
  try {
    const docRef = await addDoc(collection(db, 'lancamentos'), lancamento);
    console.log("Lançamento adicionado com ID: ", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar o lançamento: ", e);
  }
};

// Função para buscar todos os lançamentos
export const getLancamentos = async () => {
  const lancamentosSnapshot = await getDocs(collection(db, 'lancamentos'));
  const lancamentosList = lancamentosSnapshot.docs.map(doc => doc.data());
  return lancamentosList;
};
