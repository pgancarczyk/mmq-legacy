const Sequelize = require("sequelize");
const Model = Sequelize.Model;
const sequelize = require("../src/scripts/db");
const Song = require('./Song');
const User = require('./User');

class Report extends Model {}
Report.init({
    status: {
        type: Sequelize.ENUM("NEW", "CLOSED"),
        allowNull: false,
        defaultValue: "NEW"
    },
    authorComment: {
        type: Sequelize.STRING(512),
        allowNull: false
    },
    moderatorComment: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    modelName: 'report',
});
Report.hasOne(Song);
Report.belongsTo(User, {as: "author"});
Report.belongsTo(User, {as: "moderator"});

Report.sync({alter: process.env.NODE_ENV === 'dev'});

module.exports = Report;