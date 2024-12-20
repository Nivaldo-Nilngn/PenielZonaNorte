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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Obtém o objeto do usuário
      console.log('Login bem-sucedido!');
      
      // Salvar o email e UID no localStorage
      localStorage.setItem('email', user.email || '');
      localStorage.setItem('uid', user.uid);
      
      // Redirecionar ou atualizar o estado do aplicativo aqui, se necessário
    } catch (err) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
      console.error(err);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title><Logo src={logo} alt="Logo da Igreja Peniel" /></Title>
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
  background: #2c3e50;
  height: 100%;
  width: 100%;
   
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
`;

const LoginBox = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  width: 100%;
  margin: 20px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  text-align: center;
  animation: fadeIn 0.5s; 
  
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
  width: 250px;  
  margin-top: -40px; 
  margin-bottom: 5px; 
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-family: 'Georgia', serif; 
`;

const Input = styled.input`
  width: 90%;
  padding: 10px; 
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border 0.3s, box-shadow 0.3s;

  &:focus {
    border: 1px solid #2980b9; 
    outline: none;
    box-shadow: 0 0 5px rgba(41, 128, 185, 0.5); 
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 30px; 
  margin-bottom: 15px; 
  background-color: #2980b9; 
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover { 
    background-color: #1a5276; 
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px; 
`;

export default LoginScreen;
