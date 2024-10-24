import { Item } from '../types/Item';

// Função para obter o mês atual
export const getCurrentMonth = () => {
  let now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // Formato YYYY-MM
};

// Função para filtrar a lista pelo mês selecionado
export const filterListByMonth = (list: Item[], date: string): Item[] => {
  let newList: Item[] = [];
  let [year, month] = date.split('-');

  // Converta os valores de mês e ano para número
  const targetYear = parseInt(year);
  const targetMonth = parseInt(month) - 1; // Ajuste para zero-based (Janeiro = 0)

  for (let item of list) {
    // Certifique-se de que a data é convertida corretamente
    const itemDate = new Date(item.date); // Certifique-se que item.date é uma string ISO

    // Verifique se a data do item está no mesmo ano e mês
    if (
      itemDate.getFullYear() === targetYear &&
      itemDate.getMonth() === targetMonth
    ) {
      newList.push(item);
    }
  }

  return newList;
};



// Formata a data no formato DD/MM/YYYY
export const formatDate = (date: Date): string => {
  let day = String(date.getDate()).padStart(2, '0');
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Atualiza as datas dos itens ao selecionar um novo mês
export const updateItemDates = (items: Item[], selectedMonth: string, selectedYear: string): Item[] => {
  return items.map(item => {
    const originalDate = new Date(item.date); // Assume que item.date é um objeto Date
    const newDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, originalDate.getDate()); // Converte para número
    return { ...item, date: newDate }; // Mantém como Date
  });
};


// Formata o mês atual
export const formatCurrentMonth = (currentMonth: string): string => {
  let [year, month] = currentMonth.split('-');
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return `${months[parseInt(month) - 1]} de ${year}`;
};


export const newDateAdjusted = (dateField: string) => {
  let [year, month, day] = dateField.split('-')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}