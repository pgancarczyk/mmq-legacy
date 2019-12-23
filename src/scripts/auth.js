const jwt = require('express-jwt');
const User = require('../../models/User');

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
        credentialsRequired: false
    }),
    user: (req) => {
        req.user = User.findByPk(req.auth.id, {logging: true, raw: true});
        console.log(req.user);
        return req;
    }
};

module.exports = auth;