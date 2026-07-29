import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, addReview);
router.get('/product/:productId', getProductReviews);

export default router;
