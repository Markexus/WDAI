// Moduł do obsługi koszyka

import { DataTypes, Sequelize } from 'sequelize';
import {sequelize} from '../config/db.js';
import { productSchema } from './Product.js';

// Schemat koszyka
const cartSchema = sequelize.define('Carts', {
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false
});


// Model dla produktów w koszyku
const cartItemSchema = sequelize.define('CartItems', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Products",
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false
});


// Relacje
cartSchema.hasMany(cartItemSchema, { foreignKey: 'cartId', as: "cartItems" });
cartItemSchema.belongsTo(cartSchema, { foreignKey: 'cartId', as: "cart" });

cartItemSchema.belongsTo(productSchema, { foreignKey: 'productId', as: 'product' });
productSchema.hasMany(cartItemSchema, { foreignKey: 'productId', as: 'cartItems' });



export { cartSchema, cartItemSchema };