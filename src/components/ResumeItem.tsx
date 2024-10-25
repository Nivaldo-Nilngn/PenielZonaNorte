import styled from 'styled-components';

type Props = {
  title: string;
  value: number; // Mantemos como number aqui, mas formatamos antes de passar ao componente
  color?: string;
}

export const ResumeItem = ({ title, value, color }: Props) => {
  // Função para formatar o valor como moeda brasileira
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Info color={color}>{formatCurrency(value)}</Info> {/* Formatando o valor aqui */}
    </Container> 
  );
}

const Container = styled.div`
  flex: 1;
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
  color: #888;
  margin-bottom: 5px;
`;

const Info = styled.div<{ color?: string }>`
  text-align: center;
  font-weight: bold;
  color: ${props => props.color ?? '#000'};
`;
