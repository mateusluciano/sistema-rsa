import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  getAllUsers, 
  updateUser, 
  changePassword 
} from '../controllers/usuarioController';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Rotas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas protegidas
router.get('/me', authMiddleware, getCurrentUser);
router.get('/all', authMiddleware, adminMiddleware, getAllUsers);
router.put('/:id', authMiddleware, updateUser);
router.post('/change-password', authMiddleware, changePassword);

export default router;
