const Sequelize = require("sequelize");
const Model = Sequelize.Model;

var sequelize = require("../src/scripts/db");

class User extends Model {}
User.init({
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.ENUM('USER', 'MOD', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER'
    },
    hash: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user'
});
User.sync({alter: process.env.NODE_ENV === 'dev'});

module.exports = User;