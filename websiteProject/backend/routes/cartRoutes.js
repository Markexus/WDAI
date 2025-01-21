// Plik do dodawanie routów do koszyka

import { Router } from 'express';
import { addToCart, removeFromCart, getCart } from '../controllers/cartControllers.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Dodannie routów
router.post('/', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.get('/', protect, getCart);

export default router;