import styled from 'styled-components';
import { formatCurrentMonth } from '../helpers/dateFilter';
import { ResumeItem } from "./ResumeItem";

type Props = {
  currentMonth: string;
  onMonthChange: (newMonth: string) => void;
  income: number;
  expense: number;
}

export const InfoArea = ({ currentMonth, onMonthChange, income, expense }: Props) => {
  // Funções para mudar o mês
  const handlePrevMonth = () => {
    let [year, month] = currentMonth.split('-');
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    currentDate.setMonth(currentDate.getMonth() - 1);
    onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
  };

  const handleNextMonth = () => {
    let [year, month] = currentMonth.split('-');
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    currentDate.setMonth(currentDate.getMonth() + 1);
    onMonthChange(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`);
  };

  return (
    <Container>
      <MonthArea>
        <MonthArrow onClick={handlePrevMonth}>⬅️</MonthArrow>
        <MonthTitle>{formatCurrentMonth(currentMonth)}</MonthTitle>
        <MonthArrow onClick={handleNextMonth}>➡️</MonthArrow>
      </MonthArea>
      <ResumeArea>
        <ResumeItem title='Receitas' value={income} /> {/* Passando como number */}
        <ResumeItem title='Despesas' value={expense} /> {/* Passando como number */}
        <ResumeItem
          title='Balanço'
          value={income - expense} // Passando como number
          color={(income - expense) < 0 ? 'red' : 'green'}
        />
      </ResumeArea>
    </Container>
  );
}

const Container = styled.div`
  background-color: #FFF;
  box-shadow: 0px 0px 5px #CCC;
  border-radius: 10px;
  padding: 20px;
  margin-top: 5px;
  display: flex;
  flex-direction: column; /* Altera a direção dos filhos para coluna */
  align-items: center; /* Centraliza os itens horizontalmente */
  
  @media (min-width: 768px) {
    flex-direction: row; /* Altera para linha em telas maiores */
    justify-content: space-between; /* Espaça os itens uniformemente */
  }
`;

const MonthArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center; /* Centraliza o conteúdo horizontalmente */

  @media (min-width: 768px) {
    justify-content: flex-start; /* Alinha à esquerda em telas maiores */
  }
`;

const MonthArrow = styled.div`
  width: 40px;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
`;

const MonthTitle = styled.div`
  flex: 1;
  text-align: center;
`;

const ResumeArea = styled.div`
  flex: 2;
  display: flex;
  flex-wrap: wrap; /* Permite que os itens quebrem linha se não houver espaço */
  justify-content: center; /* Centraliza os itens no eixo principal */
  margin-top: 10px; /* Adiciona espaço acima no modo mobile */

  @media (min-width: 768px) {
    margin-top: 0; /* Remove o espaço acima em telas maiores */
    justify-content: flex-start; /* Alinha à esquerda em telas maiores */
  }
`;