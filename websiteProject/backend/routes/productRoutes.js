// Plik do obsługi routerów dla produktów

import { Router } from 'express';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct, getFilteredProducts, getCategories } from '../controllers/productControllers.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

// Dodanie routerów
router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/', protect, admin, addProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.get('/filtered', getFilteredProducts);
router.get('/:id', getProductById);

export default router;