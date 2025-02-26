# Sistema Financeiro | Peniel Zona Norte

Este projeto é um sistema financeiro desenvolvido em **React** com **TypeScript** e **Firebase**, permitindo o gerenciamento de receitas e despesas. 

## 🚀 Funcionalidades
- Adição de receitas e despesas.
- Cálculo automático do saldo total.
- Filtragem de transações por mês.
- Exibição de dados em tabela.
- Visualização de gráficos financeiros.
- Interface responsiva para dispositivos móveis.

## 🛠 Tecnologias Utilizadas
- **React** com **TypeScript**
- **Styled Components** (para estilização)
- **Firebase** (Realtime Database para armazenamento de dados)

## 📁 Estrutura do Projeto
```
📂 src
 ┣ 📂 components
 ┃ ┣ 📜 InfoArea.tsx
 ┃ ┣ 📜 InputArea.tsx
 ┃ ┣ 📜 TableArea.tsx
 ┃ ┣ 📜 Graphs.tsx
 ┃ ┗ 📜 ToggleButton.tsx
 ┣ 📂 helpers
 ┃ ┗ 📜 dateFilter.ts
 ┣ 📂 types
 ┃ ┗ 📜 Item.ts
 ┣ 📜 firebaseConfig.ts
 ┣ 📜 App.tsx
 ┗ 📜 index.tsx
```

## ⚙️ Configuração e Instalação
1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/sistema-financeiro.git
   ```
2. Acesse a pasta do projeto:
   ```sh
   cd sistema-financeiro
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure o Firebase:
   - Crie um projeto no Firebase.
   - Adicione um banco de dados Realtime Database.
   - No arquivo **firebaseConfig.ts**, insira suas credenciais do Firebase.

5. Inicie o projeto:
   ```sh
   npm start
   ```

## 📊 Como Usar
1. Adicione receitas e despesas através do formulário.
2. Utilize o seletor de meses para filtrar os dados.
3. Clique no botão "Ver Gráficos" para visualizar os dados em formato gráfico.

## 📌 Melhorias Futuras
- Exportação de relatórios em PDF.
- Implementação de autenticação de usuários.
- Melhorias na interface gráfica.

## 📄 Licença
Este projeto está sob a licença **MIT**.

---
Desenvolvido por **Peniel Zona Norte** 🚀
