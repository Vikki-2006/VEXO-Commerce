import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/address', authenticateToken, addAddress);
router.delete('/address/:id', authenticateToken, deleteAddress);

export default router;
