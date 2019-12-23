const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../src/scripts/db");
const User = require("./User")

class Player extends Model {}
Player.init({
    guessed: {
        type: Sequelize.ENUM("NONE", "TITLE", "ARTIST", "BOTH"),
        allowNull: false,
        defaultValue: "NONE"
    }
}, {
    sequelize,
    modelName: 'player',
});
Player.hasOne(User);
Player.sync({alter: process.env.NODE_ENV === 'dev'});

module.exports = Player;