const express = require('express');
const router = express.Router();
const sequelize = require('../src/scripts/db');
const { User, Token } = require('../models/User');
const Song = require('../models/Song');
const auth = require('../src/scripts/auth');
const passport = require('../src/scripts/passport');
const longpoll = require("express-longpoll")(router);
const game = require('../src/scripts/Game')(longpoll);
const crypto = require('crypto');
const Op = require('sequelize').Op;

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

/*router.get('/remember', auth.remember, (req, res) => {
    if(req.user) {
        return res.json({user: req.user.getAuthData()});
    }
});*/

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
        if(req.body.remember) {
            let token = crypto.randomBytes(8).toString('hex');
            console.log(token);
            Token.create({value: token}).then(token => {
                user.addToken(token).then(() => {
                    res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 604800000});
                    return res.json({user: user.getAuthData()});
                });
            });
        }
        else return res.json({user: user.getAuthData()});
    })(req, res, next);
});


router.post('/logout', auth.required, auth.user, (req, res) => {
    res.clearCookie('remember_me');
    res.logout();
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

router.get('/admin/users/:page/:search*?', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    let opts = {
        limit: 10,
        offset: (req.params.page-1)*10
    };
    let search = req.params.search;
    if(search && search.trim() !== '') {
        search = search.trim().toLowerCase();
        opts.where = {
            'name': sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), {[Op.like]: '%'+search+'%'})
        };
    }
    User.findAndCountAll(opts).then(users => {
        return res.json({message: 'ok', list: users});
    });
});

router.get('/admin/songs/:page/:search*?', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    let opts = {
        limit: 10,
        offset: (req.params.page-1)*10
    };
    let search = req.params.search;
    if(search && search.trim() !== '') {
        search = search.trim().toLowerCase();
        opts.where = {
            [Op.or]: [
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('artist')), {[Op.like]: '%'+search+'%'}
                ),
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('title')), {[Op.like]: '%'+search+'%'}
                )
            ]
        };
    }
    Song.findAndCountAll(opts).then(songs => {
        return res.json({message: 'ok', list: songs});
    });
});

router.put('/admin/song/:id', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    Song.findByPk(req.params.id).then(song => {
        if (!song) return res.status(404).json({message: 'song with id ' + req.params.id + ' does not exist'});
        song.update(req.body).then(() => {
            return res.json({message: 'ok', song: song});
        });
    })
});

router.put('/admin/user/:id', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    User.findByPk(req.params.id).then(user => {
        if (!user) return res.status(404).json({message: 'user with id ' + req.params.id + ' does not exist'});
        user.update(req.body.user).then(() => {
            if (req.body.password) {
                user.setPassword(req.body.password);
                user.save();
            }
            return res.json({message: 'ok', user: user});
        });
    })
});

router.delete('/admin/song/:id', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    Song.findByPk(req.params.id).then(song => {
        if (!song) return res.status(404).json({message: 'song with id ' + req.params.id + ' does not exist'});
        song.destroy().then(() => {
            return res.json({message: 'ok', song: {id: req.params.id}});
        });
    })
});

router.delete('/admin/user/:id', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    User.findByPk(req.params.id).then(user => {
        if (!user) return res.status(404).json({message: 'user with id ' + req.params.id + ' does not exist'});
        user.destroy().then(() => {
            return res.json({message: 'ok', user: {id: req.params.id}});
        });
    })
});

router.post('/admin/song', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    Song.create(req.body).then(() => {
            return res.json({message: 'ok'});
    });
});

router.post('/admin/user', auth.required, auth.user, (req, res) => {
    if(req.user.role !== 'ADMIN') return res.status(403).json({message: 'unauthorized'});
    let user = User.build(req.body.user);
    user.setPassword(req.body.password);
    user.save().then(() => {
        return res.json({message: 'ok'});
    });
});

router.get('/', function(req, res, next) {
  res.status(404).end();
});

module.exports = router;
