require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
var cors = require('cors');

const server = express();

server.use(cors({credentials: true, origin: true}));
server.use(express.json());
server.use(bodyParser.json());
server.use(cookieParser());
server.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true}));
server.use(passport.initialize());
server.use(passport.session());
server.use(passport.authenticate('remember-me'));
server.use(express.static(path.join(__dirname, '/../build')));
const apiRouter = require('../routes/api');
server.use('/api', apiRouter);

server.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../build/index.html'));
});

// error handler
server.use((err, req, res, next) => {
    if(!res.headersSent) {
        if (process.env.NODE_ENV === 'dev') {
            console.error(err);
        }
        res.status(err.status || 500);
        res.json({message: process.env.NODE_ENV === 'dev' ? JSON.stringify(err) : "something went wrong"});
    }
    next();
});

module.exports = server;
