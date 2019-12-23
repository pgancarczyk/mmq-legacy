const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../src/scripts/auth');
const passport = require('../src/scripts/passport');
const sequelize = require('../src/scripts/db');

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
            if (user) return res.status(200).json({
                error: 'name already taken'
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
        if (!user) return res.status(200).json(info);
        return res.json({user: user.getAuthData()});
    })(req, res, next);
});

router.get('/blabla', auth.required, auth.user, (req, res) => {
    return res.json(req.user);
});

router.get('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
