// Model produtku w bazie danych

import { DataTypes } from 'sequelize';
import {sequelize} from '../config/db.js'; 

// Tworzenie modelu Product
const productSchema = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    availableQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 50
    }
});


export {productSchema};