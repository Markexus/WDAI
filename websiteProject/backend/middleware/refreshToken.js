import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {generateAccessToken} from '../utils/jwtGenerator.js';

// Wczytanie zmiennych środowiskowych
dotenv.config();

// Funkcja odświeżania tokenów
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token jest wymagany' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    // Generowanie nowego tokena dostępowego
    const accesstoken = generateAccessToken(userId);

    res.status(201).json({ accesstoken });
  } catch (err) {
    res.status(401).json({ message: 'Nie prawidłowy refresh token' });
  }
};

export { refreshAccessToken };