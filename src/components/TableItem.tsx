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
  const valueColor = category && category.expense ? 'red' : 'green';

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
          R$ {item.value}
        </Value>
      </TableColumn>
      <TableColumn>
        <ActionButton onClick={onDelete}>🗑️</ActionButton>
      </TableColumn>
    </TableLine>
  );
}

const TableLine = styled.tr``;

const TableColumn = styled.td`
  padding: 10px 0;
`;

const Category = styled.div<{ color: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 5px;
  color: #FFF;
  background-color: ${(props) => props.color};
`;

const Value = styled.div<{ color: string }>`
  color: ${(props) => props.color};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 5px;
  color: #888;

  &:hover {
    color: #000;
  }
`;
