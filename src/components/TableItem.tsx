import styled from "styled-components";
import { Item } from "../types/Item";
import { formatDate } from '../helpers/dateFilter';
import { categories } from '../data/categories';

type Props = {
  item: Item;
  onDelete: () => void;
}

export const TableItem = ({ item, onDelete }: Props) => {
  const category = categories[item.category];
  const categoryColor = category ? category.color : "#000";
  const categoryTitle = category ? category.title : "Desconhecida";
  const valueColor = category && category.expense ? '#e74c3c' : '#27ae60';

  return (
    <TableLine>
      <TableColumn>{formatDate(item.date)}</TableColumn>
      <TableColumn>
        <Category color={categoryColor}>
          {categoryTitle}
        </Category>
      </TableColumn>
      <TableColumn>{item.title}</TableColumn>
      <TableColumn>
        <Value color={valueColor}>
          {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Value>
      </TableColumn>
      <TableColumn>
        <ActionButton onClick={onDelete} title="Excluir item">🗑️</ActionButton>
      </TableColumn>
    </TableLine>
  );
}

const TableLine = styled.tr`
  transition: background-color 0.3s, box-shadow 0.3s;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background-color: #f5f8fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const TableColumn = styled.td`
  padding: 10px;
  font-size: 20px; /* Aumentei um pouco a fonte para melhor legibilidade */
  color: #34495e;
  border: 2px solid #f5f8fa;
  text-align: center;

  /* Estilos responsivos */
  @media (max-width: 768px) {
    font-size: 12px; /* Tamanho da fonte menor em telas pequenas */
    padding: 8px; /* Menos padding para caber mais conteúdo */
  }
`;

const Category = styled.div<{ color: string }>`
  display: inline-block;
  padding: 6px 10px; /* Ajustei o padding para ser mais compacto */
  border-radius: 15px;
  font-size: 14px; /* Tamanho da fonte ajustado */
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => props.color};
  text-transform: capitalize;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

const Value = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: 600;
  font-size: 14px; /* Tamanho da fonte ajustado */
  letter-spacing: 0.5px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px; /* Tamanho da fonte ajustado */
  color: #888;
  transition: color 0.3s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  margin: 0 auto;

  &:hover {
    color: #e74c3c;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

export default TableItem;
