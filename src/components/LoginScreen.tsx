import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Função para realizar login
  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido!');
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
      console.error(err);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>Igreja Peniel Zona Norte</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ActionButton onClick={handleLogin}>
          Entrar
        </ActionButton>
      </LoginBox>
    </Container>
  );
};

// Componentes estilizados
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #2c3e50, #34495e);
`;

const LoginBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-family: 'Georgia', serif; /* Fonte mais elegante */
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #2980b9; /* Cor azul mais suave */
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1a5276; /* Azul mais escuro ao passar o mouse */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

export default LoginScreen;
