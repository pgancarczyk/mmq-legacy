const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const auth = require('../src/scripts/auth');
const passport = require('../src/scripts/passport');
const sequelize = require('../src/scripts/db');
const longpoll = require("express-longpoll")(router);
const game = require('../src/scripts/Game')(longpoll);

longpoll.create('/update');

router.post('/registerGuest', (req, res, next) => {
    let askedName = req.body.user.name;
    if (!askedName) {
        return res.status(400).json({
            message: 'name is required'
        });
    }
    User.findOne({where:{ name: sequelize.where(sequelize.fn('lower', sequelize.col('name')), askedName.toLowerCase())}})
        .then(user => {
            if (user || game.findGuest(askedName)) return res.status(422).json({
                message: 'name already taken'
            });
            else {
                return res.json({
                    user: {
                        name: askedName
                    }
                });
            }
        });
});

router.post('/register', (req, res, next) => {
    const { body: { user }} = req;
    if (!user.name) {
        return res.status(400).json({
            error: 'name is required'
        });
    }
    if (!user.password) {
        return res.status(400).json({
            error: 'password is required'
        });
    }
    User.findOne({where:{ name: sequelize.where(sequelize.fn('lower', sequelize.col('name')), user.name.toLowerCase())}})
        .then(user => {
            if (user) return res.status(422).json({
                message: 'name already taken'
            });
        });

    const finalUser = User.build({ name: user.name });
    finalUser.setPassword(user.password);
    finalUser.save()
        .then(() => res.json({user: finalUser.getAuthData()}))
        .catch(err => {
            next(err);
        });
});

router.post('/login', (req, res, next) => {
    if(!req.body.user.name || !req.body.user.password) return res.status(400).json({message: 'fields name and passwords are required'});
    passport.authenticate('local', {}, (err, user, info) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(401).json(info);
        return res.json({user: user.getAuthData()});
    })(req, res, next);
});

router.get('/songs', (req, res) => {
        return res.json({message: 'ok', songs: game.getSongs()});
});

router.get('/players', (req, res) => {
    return res.json({message: 'ok', players: game.getPlayers()});
});

router.post('/guessed', auth.optional, auth.user, (req, res) => {
    if(!req.user && !req.guestName) return res.status(401).json({message: 'log in or provide guest name'});
    if(!req.body.guessed) return res.status(400).json({message: 'no guessed input provided'});
    game.setGuessed(req.user ? req.user : req.guestName, req.body.guessed);
    return res.json({message: 'ok'});
});

router.get('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
