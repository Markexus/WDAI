import { DataTypes } from 'sequelize';
import {sequelize} from '../config/db.js';
import {productSchema} from './Product.js';
import {orderSchema} from './Order.js';

const orderItemSchema = sequelize.define('OrderItem', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Orders',
            key: 'id',
        },
    },
}, {
    timestamps: false,
});

orderItemSchema.belongsTo(productSchema, { as: 'Product', foreignKey: 'productId' });
productSchema.hasMany(orderItemSchema, { as: 'OrderItems', foreignKey: 'productId' });

orderItemSchema.belongsTo(orderSchema, { as: 'Order', foreignKey: 'orderId' });
orderSchema.hasMany(orderItemSchema, { as: 'OrderItems', foreignKey: 'orderId' });

export { orderItemSchema };