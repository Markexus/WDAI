// Model użytownika w bazie danych

import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

// Tworzenie shematu
const userSchema = sequelize.define('Users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false,
        validate: {
            isIn: [['user', 'admin']]
        }
    }
}, {
    timestamps: false
});

// Haszowanie hasła przed zapisem do bazy danych
userSchema.beforeSave(async (user) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }   
});

// Metoda do porównywania hasła
userSchema.prototype.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


export { userSchema };