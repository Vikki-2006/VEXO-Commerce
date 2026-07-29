import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);
router.get('/admin/all', authenticateToken, requireAdmin, getAllOrders);
router.patch('/admin/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;
