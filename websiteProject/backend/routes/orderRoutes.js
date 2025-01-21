// Plik do obłsygi tras dla zamówień

import { Router } from 'express';
import { createOrder, getOrderHistory, getOrderDetails } from '../controllers/orderControllers.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Dodanie routerów
router.post('/createOrder', protect, createOrder);
router.get('/', protect, getOrderHistory);
router.get('/:orderid', protect, getOrderDetails);

export default router;