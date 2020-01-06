const { User } = require('../../models/User');

class Player {
    constructor(stringOrUser) {
        if (stringOrUser instanceof User) {
            this.isUser = true;
            this.name = stringOrUser.name;
        }
        else if (typeof stringOrUser === 'string') {
            this.isUser = false;
            this.name = stringOrUser;
        }
        else throw 'Player constructor needs either User object or a string, ' + typeof (stringOrUser) + ' provided';
        this.score = 0;
        this.guessed = "NONE";
    }
}

module.exports = Player;