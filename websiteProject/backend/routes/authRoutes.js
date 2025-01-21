// Dodanie routów do obsługi uzytkowników

import { Router } from 'express';
import controllers from '../controllers/authControllers.js';
import { getUserFullProfile } from '../controllers/authControllers.js';
import { protect } from '../middleware/auth.js';
import { refreshAccessToken } from '../middleware/refreshToken.js';

// Inicjalizacja routera
const router = Router();

// Ustawienie tras API i kontrolerów
router.post('/register', controllers.register);
router.post('/login', controllers.login);
router.get('/profile', protect, controllers.getUserProfile)
router.post('/refreshToken', refreshAccessToken);
router.get('/profile', getUserFullProfile);
export default router;