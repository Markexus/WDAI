import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Wczytanie zmiennych środowiskowych
dotenv.config();

// Generowanie access tokena
export const generateAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Generowanie refresh tokena
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};