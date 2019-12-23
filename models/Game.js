const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../src/scripts/db");
const Round = require('./Round');

class Game extends Model {}
Game.init({
}, {
    sequelize,
    modelName: 'game',
});
Game.hasMany(Round);

Game.sync({alter: process.env.NODE_ENV === 'dev'});

module.exports = Game;