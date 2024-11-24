import styled from "styled-components";
import { Item } from '../types/Item';
import { formatDate } from '../helpers/dateFilter'; // Importando a função formatDate
import { categories } from '../data/categories'; // Importando os dados de categorias

type TableItemProps = {
  item: Item;
  onDelete: () => void;
};

const TableItem = ({ item, onDelete }: TableItemProps) => {
  const category = categories[item.category];
  const categoryColor = category ? category.color : "#000";
  const categoryTitle = category ? category.title : "Desconhecida";
  const valueColor = category && category.expense ? '#e74c3c' : '#27ae60';

  return (
    <Card>
      <CardContent>
        <CardRow>
          <CardLabel>Data:</CardLabel>
          <CardValue>{formatDate(item.date)}</CardValue>
        </CardRow>
        <CardRow>
          <CardLabel>Categoria:</CardLabel>
          <CardValue style={{ color: categoryColor }}>{categoryTitle}</CardValue>
        </CardRow>
        <CardRow>
          <CardLabel>Título:</CardLabel>
          <CardValue>{item.title}</CardValue>
        </CardRow>
        <CardRow>
          <CardLabel>Valor:</CardLabel>
          <CardValue style={{ color: valueColor, fontSize: '1.5em', fontWeight: 'bold' }}>
            {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </CardValue>
        </CardRow>
        <CardRow>
          <CardButton onClick={onDelete}>Excluir</CardButton>
        </CardRow>
      </CardContent>
    </Card>
  );
};

type Props = {
  list: Item[];
  onDelete: (item: Item) => void;
  actionsEnabled?: boolean;
};

export const TableArea = ({ list, onDelete, actionsEnabled = true }: Props) => {
  return (
    <Container>
      {list.length === 0 ? (
        <EmptyMessage>Nenhum item encontrado.</EmptyMessage>
      ) : (
        <>
          <TableContainer>
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
                {list.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell data-label="Data">{formatDate(item.date)}</TableCell>
                    <TableCell data-label="Categoria" style={{ color: categories[item.category]?.color || "#000" }}>
                      {categories[item.category]?.title || "Desconhecida"}
                    </TableCell>
                    <TableCell data-label="Título">{item.title}</TableCell>
                    <TableCell data-label="Valor" style={{ color: categories[item.category]?.expense ? '#e74c3c' : '#27ae60' }}>
                      {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                    <TableCell data-label="Ações">
                      <CardButton onClick={actionsEnabled ? () => onDelete(item) : undefined}>Excluir</CardButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          <CardContainer>
            {list.map((item, index) => (
              <TableItem 
                key={index} 
                item={item}
                onDelete={actionsEnabled ? () => onDelete(item) : () => {}}
              />
            ))}
          </CardContainer>
        </>
      )}
      {!actionsEnabled && list.length > 0 && (
        <DisabledActionsMessage>
          A exclusão de itens está desabilitada no momento.
        </DisabledActionsMessage>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  width: 100%;
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
`;

const CardContainer = styled.div`
  display: none;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #f5f8fa;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CardLabel = styled.div`
  font-weight: bold;
  color: #34495e;
`;

const CardValue = styled.div`
  color: #34495e;
`;

const CardButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #c0392b;
    transform: scale(1.05);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #888;
`;

const DisabledActionsMessage = styled.div`
  text-align: center;
  color: #999;
  font-size: 14px;
  padding: 15px;
`;

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-top: 20px;
  overflow: hidden;
  border-collapse: collapse;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TableHeadColumn = styled.th<{ width?: number }>`
  padding: 12px 15px;
  text-align: center;
  width: ${(props) => (props.width ? `${props.width}px` : 'auto')};
  background: #34495e;
  color: #fff;
  font-weight: bold;
  border-bottom: 2px solid #ddd;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 10px 5px;
  }
`;

const TableRow = styled.tr`
  @media (max-width: 768px) {
    display: block;
    margin-bottom: 10px;
  }
`;

const TableCell = styled.td`
  padding: 12px 15px;
  text-align: center;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    display: block;
    text-align: right;
    padding-left: 50%;
    position: relative;
    border: none;

    &:before {
      content: attr(data-label);
      position: absolute;
      left: 10px;
      font-weight: bold;
      color: #666;
    }
  }
`;

export default TableArea;
