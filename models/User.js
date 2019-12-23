const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
        type: Sequelize.STRING(1024),
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user',
});

User.sync({alter: process.env.NODE_ENV === 'dev'});

User.prototype.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
}
User.prototype.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}
User.prototype.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this.id,
        exp: parseInt(expirationDate.getTime()/1000, 10)
    }, process.env.TOKEN_SECRET);
}
User.prototype.getAuthData = function() {
    return {
        name: this.name,
        role: this.role,
        token: this.generateJWT()
    }
}

module.exports = User;