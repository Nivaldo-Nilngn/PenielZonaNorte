// components/ConfirmationModal.tsx
import React from 'react';
import styled from 'styled-components';

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Confirmar Exclusão</h2>
        <p>Você tem certeza de que deseja excluir este item?</p>
        <ButtonWrapper>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </ButtonWrapper>
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

const ButtonWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;

export default ConfirmationModal;
