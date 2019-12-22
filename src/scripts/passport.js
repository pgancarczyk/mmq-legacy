const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../../models/User');

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

module.exports = passport;