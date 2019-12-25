require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors');

const server = express();

server.use(cors({credentials: true, origin: true}));
server.use(express.json());
server.use(bodyParser.json());

server.use(express.static(path.join(__dirname, 'client/build')));
const apiRouter = require('../routes/api');
server.use('/api', apiRouter);


// error handler
server.use((err, req, res, next) => {
  if(!res.headersSent) {
      res.status(err.status || 500);
      res.json({message: process.env.NODE_ENV === 'dev' ? JSON.stringify(err) : "something went wrong"});
  }
  next();
});

module.exports = server;
