import styled from "styled-components";
import { Item } from "../types/Item";
import { formatDate } from '../helpers/dateFilter';
import { categories } from '../data/categories';

type Props = {
  item: Item;
}

export const TableItem = ({ item }: Props) => {
  // Obtém a categoria correspondente ao item
  const category = categories[item.category];

  // Verifica se a categoria existe
  const categoryColor = category ? category.color : "#000"; // Cor padrão se a categoria não existir
  const categoryTitle = category ? category.title : "Desconhecida"; // Título padrão se a categoria não existir
  const valueColor = category && category.expense ? 'red' : 'green'; // Define a cor com base na categoria

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
