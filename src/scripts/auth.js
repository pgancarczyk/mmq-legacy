const jwt = require('express-jwt');
const { User } = require('../../models/User');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization }} = req;
    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    else return null;
}

const auth = {
    required: jwt({
        secret: process.env.TOKEN_SECRET,
        getToken: getTokenFromHeaders,
        requestProperty: 'auth'
    }),
    optional: jwt({
        secret: process.env.TOKEN_SECRET,
        getToken: getTokenFromHeaders,
        requestProperty: 'auth',
        credentialsRequired: false
    }),
    user: (req, res, next) => {
        if(req.auth) {
            User.findByPk(req.auth.id).then(user => {
                req.user = user;
                next();
            });
        }
        else {
            if (req.headers.authorization.split(' ')[0] === 'Guest') {
                req.guestName = req.headers.authorization.split(' ')[1];
            }
            next();
        }
    },
    /*remember: (req, res, next) => {
        if(req.isAuthenticated()) {
            console.log(req.isAuthenticated());
        }
        next();
    }*/
};

module.exports = auth;