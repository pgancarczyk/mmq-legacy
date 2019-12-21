const Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('db connected')
    })
    .catch(err => {
        console.error('unable to connect to db: ', err)
    });

module.exports = sequelize;