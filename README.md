# Sistema de Gestão de Caçambas

Sistema para gerenciamento de locação de caçambas e destinação de resíduos, com rastreamento de caçambas, controle operacional e integração com Conta Azul.

## Estrutura do Projeto

O projeto está organizado em três diretórios principais:

- **backend**: API Node.js com Express e Prisma ORM
- **frontend**: Aplicação React com TypeScript e Tailwind CSS
- **docs**: Documentação do projeto

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Integração com Conta Azul

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios para requisições HTTP
- HeadlessUI e HeroIcons para componentes

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js (v14+)
- npm ou yarn
- PostgreSQL

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd sistema-gestao-cacambas
```

2. Configure o backend:
```bash
cd backend
npm install
```

3. Configure o frontend:
```bash
cd frontend
npm install
```

4. Configure o banco de dados:
```bash
cd backend
npx prisma migrate dev
```

## Executando o Projeto

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

## Funcionalidades Principais

- Rastreamento de caçambas (localização, status)
- Gestão de clientes (PF e PJ)
- Controle de locações com regras específicas para PF e PJ
- Registro de movimentações (colocação, retirada, troca)
- Gestão de destinadoras e certificados
- Integração com Conta Azul para faturamento
- Relatórios operacionais e gerenciais

## Próximos Passos

1. Implementação do modelo de dados
2. Desenvolvimento de APIs básicas
3. Implementação de autenticação
4. Desenvolvimento do frontend
5. Integração com Conta Azul
6. Módulo de planejamento logístico (fase 2)

## Licença

Este projeto é proprietário e confidencial.
