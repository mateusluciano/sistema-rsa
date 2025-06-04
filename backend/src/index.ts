import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Importação das rotas
import cacambaRoutes from './routes/cacambaRoutes';
import clienteRoutes from './routes/clienteRoutes';
import locacaoRoutes from './routes/locacaoRoutes';

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização do Prisma Client
export const prisma = new PrismaClient();

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rotas
app.use('/api/cacambas', cacambaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/locacoes', locacaoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Gestão de Caçambas funcionando!' });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
});

// Fechamento do Prisma Client quando a aplicação for encerrada
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
