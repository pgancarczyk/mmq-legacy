const passport = require('passport');
const LocalStrategy = require('passport-local');
const RememberMeStrategy = require('passport-remember-me').Strategy;
const { User, Token } = require('../../models/User');
const crypto = require('crypto');

passport.use(new LocalStrategy({ usernameField: 'user[name]', passwordField: 'user[password]'}, (name, password, done) => {
    User.findOne({ where: { name: name }})
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { message: 'name and password combination incorrect'});
            }
            else return done(null, user);
        })
        .catch(err => done(err));
}));

passport.use(new RememberMeStrategy(
    (token, done) => { // get user for the token
        Token.findOne({where: {value: token}, include: [ {model: User }]})
            .then(token => {
                if(token) {
                    let user = token.user;
                    Token.destroy();
                    return done(null, user);
                }
                else return done(null, false);
            })
            .catch(err => done(err));
    }, // generate new token
    (user, done) => {
        let token = crypto.randomBytes(16).toString('hex');
        Token.create(
            {value: token, User: user},
            {include: User}
        );
        return done(token);
    }
));

module.exports = passport;