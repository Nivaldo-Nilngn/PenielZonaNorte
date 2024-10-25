// components/ConfirmationModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void; // Alterado para receber a senha
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  if (!show) return null;

  const handleConfirm = () => {
    onConfirm(password); // Passa a senha para a função de confirmação
    setPassword(''); // Limpa a senha após a confirmação
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>Confirmar Exclusão</Title>
        <Message>Tem certeza de que deseja excluir este item?</Message>
        <StyledInput
          type="password"
          placeholder="Senha do administrador"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonWrapper>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirm}>Confirmar</ConfirmButton>
        </ButtonWrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

// Estilos personalizados
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  background: #f8f9fa;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  transform: scale(0.9);
  animation: scaleUp 0.3s ease-in-out forwards;

  @keyframes scaleUp {
    to {
      transform: scale(1);
    }
  }
`;

const Title = styled.h2`
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
`;

const Message = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const CancelButton = styled(Button)`
  background-color: #ff6b6b;
  color: white;
  border: none;

  &:hover {
    background-color: #ff4a4a;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #4caf50;
  color: white;
  border: none;

  &:hover {
    background-color: #388e3c;
  }
`;

export default ConfirmationModal;