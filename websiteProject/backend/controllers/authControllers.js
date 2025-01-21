// Plik dla kontrolerów do obsługi logowań i rejestracji użytkowników

import { userSchema } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateAccessToken } from '../utils/jwtGenerator.js';
import { cartSchema } from '../models/Cart.js';

// Logowanie uzytkownika
const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Sprawdzanie czy użytkownik istnieje
        let user = await userSchema.findOne( {where: {email}} );
        if (!user) {
            return res.status(400).json({ message: 'Niepoprawne dane logowania'});
        }

        // Sprawdzanie i porównywanie haseł
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Niepoprawne dane logowania, hasło"});
        }


        // Tworzenie tokenu (na daną wartość czasu na podstawie payload)
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Zwracanie tokenu
        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
}


// Rejestracja użytkownika
const register = async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Sprawdzanie czy użytkownik już istnieje
        let user = await userSchema.findOne( {where: {email}} );
        if (user) {
            return res.status(400).json({ message: 'Użytkownik już istnieje'});
        }
        
        // Tworzenie nowego użytkownika
        user = await userSchema.create({
            name, email, password, role: role
        });

        // Tworzenie koszyka dla nowego użytkownika
        await cartSchema.create({
            user: user.id
        });

        // Tworzenie tokenu (na daną wartość czasu na podstawie payload)
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id);

        // Zwracanie tokenu
        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
}


// Funkcja do zwracania danych użytkownika
const getUserProfile = async(req, res) => {
    const userid = req.user.userId;

    try {
        const user = await userSchema.findByPk(userid);
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony'});
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Błąd serwera');
    }
};
export const getUserFullProfile = async (req, res) => {
    try {
        const user = await userSchema.findByPk(req.user.id, {
            attributes: ['id', 'name', 'role'], // Pobierz ID, nazwę i rolę użytkownika
        });

        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie istnieje' });
        }

        res.status(200).json(user); // Zwracamy pełne dane użytkownika
    } catch (err) {
        console.error("Błąd podczas pobierania profilu użytkownika:", err.message);
        res.status(500).json({ message: 'Nie udało się pobrać profilu użytkownika' });
    }
};
export default { login, register, getUserProfile };