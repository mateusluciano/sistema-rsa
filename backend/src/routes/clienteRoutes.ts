import express from 'express';
import { 
  getAllClientes, 
  getClienteById, 
  createCliente, 
  updateCliente,
  getClientesByTipo,
  getClienteByDocumento
} from '../controllers/clienteController';

const router = express.Router();

// Rotas para clientes
router.get('/', getAllClientes);
router.get('/tipo', getClientesByTipo);
router.get('/documento/:documento', getClienteByDocumento);
router.get('/:id', getClienteById);
router.post('/', createCliente);
router.put('/:id', updateCliente);

export default router;
