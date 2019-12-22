var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
require('dotenv').config();

var apiRouter = require('../routes/api');

var server = express();

server.use(express.json());
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, 'client/build')));

server.use('/api', apiRouter);

// catch 404
server.use(function(req, res) {
  res.status(404).end();
});

// error handler
server.use(function(err, req, res) {
  res.status(err.status || 500);
  res.json({ error: process.env.NODE_ENV === 'dev' ? err : "something went wrong"});
});

module.exports = server;
