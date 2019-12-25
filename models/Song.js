const Sequelize = require("sequelize");
const Model = Sequelize.Model;
var sequelize = require("../src/scripts/db");

class Song extends Model {}
Song.init({
    artist: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.STRING
    },
    videoId: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM("NEW", "ENABLED", "DISABLED"),
        allowNull: false,
        defaultValue: "NEW"
    },
    source: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'song',
});

Song.sync({alter: process.env.NODE_ENV === 'dev'});

module.exports = Song;