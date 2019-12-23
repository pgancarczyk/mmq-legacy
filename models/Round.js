const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../src/scripts/db");
const Song = require("./Song");
const User = require("./User");

class Round extends Model {}
Round.init({
    start: {
        type: Sequelize.NUMBER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'round',
});
Round.hasOne(Song);
Round.hasMany(User, {as: "Players", through: "roundSongsPlayers"});

Round.sync({alter: process.env.NODE_ENV === 'dev'});

module.exports = Round;