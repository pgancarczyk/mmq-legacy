var express = require('express');
var router = express.Router();
const db = require('../src/scripts/db');
const User = require('../models/User');

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  User.findOrCreate({
      where: {
          name: "konf"
      }
  }).then(user => {
      res.end(JSON.stringify(user));
  }).catch(err => {
      res.end(JSON.stringify(err))
  });
});

router.get('/')

module.exports = router;
