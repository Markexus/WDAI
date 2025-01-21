// Model dla zamówienia

import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import {productSchema} from './Product.js';
import {userSchema} from './User.js';
import {cartItemSchema} from './Cart.js';


// Tworzenie modelu zamówienia
const orderSchema = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['Oczekiwanie na zapłatę', 'Przetwarzane', 'W drodze', 'Dostarczone', 'Anulowane'],
        defaultValue: 'Oczekiwanie na zapłatę',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    timestamps: false,
});

// Relacje
orderSchema.belongsTo(userSchema, { foreignKey: 'userId' });
userSchema.hasMany(orderSchema, { foreignKey: 'userId' });

export { orderSchema };