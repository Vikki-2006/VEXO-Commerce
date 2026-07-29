import { Router } from 'express';
import { getDashboardMetrics } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/metrics', authenticateToken, requireAdmin, getDashboardMetrics);

export default router;
