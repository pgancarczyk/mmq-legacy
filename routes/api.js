var express = require('express');
var router = express.Router();
const User = require('../models/User');
const auth = require('../src/scripts/auth');
const passport = require('../src/scripts/passport');

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

    const finalUser = User.build({ name: user.name });
    finalUser.setPassword(user.password);
    finalUser.save()
        .then(() => res.json({user: finalUser.getAuthData()}))
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.post('/login', (req, res, next) => {
    if(!req.body.user.name || !req.body.user.password) return res.status(400).json({message: 'fields name and passwords are required'});
    passport.authenticate('local', {}, (err, user, info) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(400).json(info);
        return res.json({user: user.getAuthData()});
    })(req, res, next);
});

router.get('/userInfo', auth.required, (req, res) => {
    console.log(req.user);
    return User.findByPk(req.user.id)
        .then((user) => {
            if(!user) return res.status(500).json('user does not exist');
            return res.json({ user: user });
        });
});

router.get('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
