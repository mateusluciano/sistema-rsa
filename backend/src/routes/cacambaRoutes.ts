import express from 'express';
import { 
  getAllCacambas, 
  getCacambaById, 
  createCacamba, 
  updateCacamba, 
  deleteCacamba,
  getCacambasByStatus
} from '../controllers/cacambaController';

const router = express.Router();

// Rotas para caçambas
router.get('/', getAllCacambas);
router.get('/status', getCacambasByStatus);
router.get('/:id', getCacambaById);
router.post('/', createCacamba);
router.put('/:id', updateCacamba);
router.delete('/:id', deleteCacamba);

export default router;
