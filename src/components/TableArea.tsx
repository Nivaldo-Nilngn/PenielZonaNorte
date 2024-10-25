import styled from "styled-components";
import { Item } from '../types/Item';
import { TableItem } from '../components/TableItem';

type Props = {
  list: Item[];
  onDelete: (item: Item) => void;
  actionsEnabled?: boolean; // Propriedade para controlar a habilitação das ações
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
            <TableItem 
              key={index} 
              item={item}
              onDelete={actionsEnabled ? () => onDelete(item) : () => {}} // Passando uma função vazia
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
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 10px;
  margin-top: 20px;
`;

const TableHeadColumn = styled.th<{ width?: number }>`
  padding: 10px 0;
  text-align: left;
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
`;
