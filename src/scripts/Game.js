const sequelize = require('./db');
const Song = require('../../models/Song');
const { User } = require('../../models/User');
const Player = require('./Player');

class Game {
    constructor(longpoll) {
        this.longpoll = longpoll;
        this.players = [];
        this.songs = [];
        this.round = 1;
        setTimeout(this.endRound.bind(this), this.getDelayTill(0));
    }

    getCurrentHalfMinute() {
        return  Math.floor(new Date().getTime() / (30 * 1000)) * 30;
    }

    getDelayTill(roundSeconds) {
        return ((30*1000 - new Date().getTime() % (30*1000) - (30-roundSeconds)*1000)/1 < 0 ? (30*1000 - new Date().getTime() % (30*1000) + roundSeconds*1000)/1 : (30*1000 - new Date().getTime() % (30*1000) - (30-roundSeconds)*1000)/1)
    }

    addSong(song) {
        this.songs.unshift(song);
        if (this.songs.length > 10) this.songs.pop();
    }

    getSongs() {
        return this.songs;
    }

    getNewSong() {
        return Song.findOne({where: {status: 'ENABLED'}, order: sequelize.fn('rand')}).then(song => {
            return {
                title: song.title,
                artist: song.artist,
                videoId: song.videoId,
                startTime: this.getCurrentHalfMinute()
            }
        });
    }

    getIndex(stringOrUser) {
        let name;
        if (stringOrUser instanceof User) name = stringOrUser.name;
        else if (typeof stringOrUser === 'string') name = stringOrUser;
        else throw 'getIndex needs either User object or a string, ' + typeof (stringOrUser) + ' provided';
        let p = this.findGuest(name);
        if (p) return this.players.indexOf(p);
        else return this.players.push(new Player(stringOrUser))-1;
    }

    findGuest(name) {
        return this.players.find(p => p.name === name);
    }

    setGuessed(stringOrUser, guessed) {
        this.players[this.getIndex(stringOrUser)].guessed = guessed;
        this.longpoll.publish('/update', {message: 'ok', players: this.getPlayers()});
    }

    getPlayers() {
        return this.players.sort((a, b) => b.score - a.score);
    }

    endRound() {
        for (let player of this.players) {
            switch(player.guessed) {
                case "BOTH":
                    player.score += 3;
                    break;
                case "TITLE":
                case "ARTIST":
                    player.score += 1;
                    break;
                default:
                    // no points added
            }
            player.guessed = "NONE";
        }
        this.getNewSong().then(song => {
            this.addSong(song);
            this.longpoll.publish('/update', {message: 'ok', players: this.getPlayers(), songs: this.getSongs(), round: this.round});
            this.round += 1;
            if (this.round > 10) {
                this.round = 1;
                console.log('End of the game. Scores:');
                console.log(this.getPlayers());
                this.players = [];
            }
            setTimeout(this.endRound.bind(this), this.getDelayTill(0));
        });

    }
}

module.exports = function(longpoll) {
    return new Game(longpoll);
}