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
  background-color: #FFF;
  box-shadow: 0px 0px 5px #CCC;
  border-radius: 10px;
  padding: 20px;
  margin-top: 5px;
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

  @media (min-width: 768px) {
    justify-content: flex-start;
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px; /* Espaço horizontal e vertical entre os itens */
  margin-top: 10px;

  @media (min-width: 768px) {
    margin-top: 0;
    justify-content: flex-start;
  }
`;

// Ajuste da margem entre os itens
const StyledResumeItem = styled(ResumeItem)`
  margin: 10px 20px;
  
  @media (min-width: 768px) {
    margin: 0 20px;
  }
`;

export default InfoArea;