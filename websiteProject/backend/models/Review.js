import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { productSchema } from './Product.js';
import { userSchema } from './User.js';

const reviewSchema = sequelize.define('Review', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Products',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    timestamps: false,
});

reviewSchema.belongsTo(productSchema, { foreignKey: 'productId' });
reviewSchema.belongsTo(userSchema, { foreignKey: 'userId' });

export { reviewSchema };
