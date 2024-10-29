import styled from "styled-components";
import { Item } from '../types/Item';
import { TableItem as OriginalTableItem } from '../components/TableItem';

type TableItemProps = {
  item: Item;
  onDelete: () => void;
};

const StyledTableItem = styled(OriginalTableItem)<TableItemProps>`
  transition: background-color 0.3s;
  padding: 12px 15px; /* Padding for the table items */

  &:hover {
    background-color: #f5f8fa; /* Light hover effect */
  }
`;

type Props = {
  list: Item[];
  onDelete: (item: Item) => void;
  actionsEnabled?: boolean;
};

export const TableArea = ({ list, onDelete, actionsEnabled = true }: Props) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeadColumn width={100}>Data</TableHeadColumn>
          <TableHeadColumn width={130}>Categoria</TableHeadColumn>
          <TableHeadColumn>Título</TableHeadColumn>
          <TableHeadColumn width={150}>Valor</TableHeadColumn>
          <TableHeadColumn width={100}>Ações</TableHeadColumn>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center' }}>
              Nenhum item encontrado.
            </td>
          </tr>
        ) : (
          list.map((item, index) => (
            <StyledTableItem 
              key={index} 
              item={item}
              onDelete={actionsEnabled ? () => onDelete(item) : () => {}}
            />
          ))
        )}
        {!actionsEnabled && (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
              A exclusão de itens está desabilitada no momento.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  width: 100%;
  max-width: 100%; /* Evitar que a tabela exceda a largura da tela */
  background-color: #fff;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 20px;
  overflow: hidden;
  border-collapse: collapse; /* Para evitar espaços extras entre as células */
`;

const TableHeadColumn = styled.th<{ width?: number }>`
  padding: 12px 15px;
  text-align: center;
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  background: #34495e;
  color: #fff; /* White text color for better contrast */
  font-weight: bold;
  border-bottom: 2px solid #ddd;

  @media (max-width: 768px) {
    font-size: 12px; /* Tamanho da fonte menor em telas pequenas */
    padding: 10px 5px; /* Ajustar o padding em telas pequenas */
  }
`;

// Você pode adicionar um estilo semelhante para TableColumn, se necessário

