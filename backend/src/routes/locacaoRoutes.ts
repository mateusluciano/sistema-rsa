import express from 'express';
import { 
  getAllLocacoes, 
  getLocacaoById, 
  createLocacao, 
  updateLocacao,
  getLocacoesByStatus,
  getLocacoesByCliente,
  registrarMovimentacao
} from '../controllers/locacaoController';

const router = express.Router();

// Rotas para locações
router.get('/', getAllLocacoes);
router.get('/status', getLocacoesByStatus);
router.get('/cliente/:clienteId', getLocacoesByCliente);
router.get('/:id', getLocacaoById);
router.post('/', createLocacao);
router.put('/:id', updateLocacao);
router.post('/movimentacao', registrarMovimentacao);

export default router;
