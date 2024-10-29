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
  const handlePrevMonth = () => {
    let [year, month] = currentMonth.split('-');
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    currentDate.setMonth(currentDate.getMonth() - 1);
    onMonthChange(`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let [year, month] = currentMonth.split('-');
    let currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    currentDate.setMonth(currentDate.getMonth() + 1);
    onMonthChange(`${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  return (
    <Container>
      <MonthArea>
        <MonthArrow onClick={handlePrevMonth}>⬅️</MonthArrow>
        <MonthTitle>{formatCurrentMonth(currentMonth)}</MonthTitle>
        <MonthArrow onClick={handleNextMonth}>➡️</MonthArrow>
      </MonthArea>
      <ResumeArea>
        <StyledResumeItem title='Receitas' value={income} />
        <StyledResumeItem title='Despesas' value={expense} />
        <StyledResumeItem
          title='Balanço'
          value={income - expense}
          color={(income - expense) < 0 ? 'red' : 'green'}
        />
      </ResumeArea>
    </Container>
  );
}

const Container = styled.div`
  background-color: #ffffff; /* Background branco */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Sombra sutil */
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const MonthArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const MonthArrow = styled.div`
  width: 40px;
  text-align: center;
  font-size: 30px; /* Aumentar o tamanho do ícone */
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #007bff; /* Cor ao passar o mouse */
  }
`;

const MonthTitle = styled.div`
  flex: 1;
  text-align: center;
  font-size: 1.8em; /* Aumentar o tamanho do texto */
  font-weight: bold; /* Texto em negrito */
  color: #343a40; /* Cor do texto escuro */
`;

const ResumeArea = styled.div`
  flex: 2;
  display: flex;
  font-size: 20px; /* Aumentar o tamanho do ícone */
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px; /* Espaço entre os itens */
  margin-top: 10px;

  @media (min-width: 900px) {
    margin-top: 0;
  font-size: 30px; /* Aumentar o tamanho do ícone */
    justify-content: flex-start;
  }
`;

const StyledResumeItem = styled(ResumeItem)`
  padding: 30px; /* Espaçamento interno */
  border-radius: 8px; /* Bordas arredondadas */
  background-color: #f0f0f0; /* Fundo claro para cada item */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05); /* Efeito de aumento ao passar o mouse */
  }
  
  @media (min-width: 768px) {
    margin: 0 15px; /* Margens em telas maiores */
  }
`;

export default InfoArea;
