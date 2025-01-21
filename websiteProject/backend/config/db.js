// Plik odpowiedzialny za połączenie z bazą danych SQLite

import dotenv from 'dotenv';
import {Sequelize} from 'sequelize'; 
import path from 'path';

// Załadowanie zmiennych środowiskowych
dotenv.config();

// Uzyskanie ścieżki do bazy z pliku .env
const dbPath = path.resolve(process.env.DB_PATH);

// Połączenie z bazą danych
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false
});

export {sequelize};