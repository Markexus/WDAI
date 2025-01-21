
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware do ochrony tras (sprawdzanie tokenu)
export const protect = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        console.log("Brak tokenu w nagłówku");
        return res.status(401).json({ message: 'Brak tokenu, brak autoryzacji' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Dodanie danych użytkownika do zapytania
        next();
    } catch (err) {
        console.error("Błąd weryfikacji tokenu:", err.message);
        res.status(401).json({ message: 'Nieprawidłowy token' });
    }
};

// Middleware do sprawdzenia, czy użytkownik ma rolę admin
export const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Zasoby administracyjne, brak dostępu' });
    }
    next();
};
