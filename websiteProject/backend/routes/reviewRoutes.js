import { Router } from 'express';
import { addReview, getReviewsByProduct, deleteReview } from '../controllers/reviewControllers.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/:productid', protect, addReview);
router.get('/:productid', getReviewsByProduct);
router.delete('/:reviewid', protect, deleteReview);

export default router;
