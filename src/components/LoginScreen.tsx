import React, { useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import logo from '../assets/logoPeniel.png'; // Importando a imagem do logo

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
        <Logo src={logo} alt="Logo da Igreja Peniel" />
        <Title>Zona Norte</Title>
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
  padding: 30px;  /* Ajuste o padding para centralizar melhor os elementos */
  width: 100%;margin: 20px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  text-align: center;
  animation: fadeIn 0.5s; /* Animação para a entrada */
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Logo = styled.img`
  width: 180px; /* Ajuste do tamanho do logo para que fique proporcional */
  margin-bottom: 10px; /* Reduzido para mais proximidade */
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-family: 'Georgia', serif; /* Fonte mais elegante */
`;

const Input = styled.input`
  width: 90%;
  padding: 10px; /* Reduzido para um tamanho mais adequado */
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s, box-shadow 0.3s;

  &:focus {
    border: 1px solid #2980b9; /* Borda azul ao focar */
    outline: none;
    box-shadow: 0 0 5px rgba(41, 128, 185, 0.5); /* Efeito de sombra ao focar */
  }
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
  margin-bottom: 10px; /* Adicionando espaço abaixo da mensagem de erro */
`;

export default LoginScreen;
