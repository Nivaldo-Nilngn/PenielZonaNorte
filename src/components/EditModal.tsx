// components/EditModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Item } from '../types/Item';

interface EditModalProps {
  show: boolean;
  item: Item | null;
  onClose: () => void;
  onSave: (item: Item) => void;
}

const EditModal: React.FC<EditModalProps> = ({ show, item, onClose, onSave }) => {
  const [title, setTitle] = useState(item ? item.title : '');
  const [value, setValue] = useState(item ? item.value : 0);
  const [category, setCategory] = useState(item ? item.category : '');

  if (!show || !item) return null;

  const handleSubmit = () => {
    const updatedItem: Item = { ...item, title, value, category };
    onSave(updatedItem);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Editar Item</h2>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          placeholder="Valor"
        />
        <Input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Categoria"
        />
        <Button onClick={handleSubmit}>Salvar</Button>
        <Button onClick={onClose}>Cancelar</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const Input = styled.input`
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 80%;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  margin: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

export default EditModal;
