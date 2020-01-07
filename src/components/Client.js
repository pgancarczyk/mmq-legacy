import '../scripts/client.css';
import React, {Component} from 'react';
import Player from "./Client/Player";
import Header from "./Header";
import Ranking from "./Client/Ranking";
import Input from "./Client/Input";
import Footer from "./Footer";
import History from "./Client/History";
import Progress from "./Client/Progress";
import levenshteinDistance from "../scripts/levenshteinDistance";
import Login from "./Client/Login";
import $ from 'jquery';
import Score from "./Client/Score";
import api from '../scripts/api';


class Client extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: " ",
            progress: 0,
            guessed: "NONE",
            title: [["swan"], ["lake"]],
            author: [["tchaikovsky"]],
            videoId: "", // "9rJoB7y6Ncs",
            role: "",
            name: "",
            loginMsg: "",
            registerMsg: "",
            guestMsg: "",
            songs: [],
            players: [],
            startTime: 42323,
            newSong: true,
            showScore: false,
            round: 0,
        }
    }

    getDelayTill(roundSeconds) {
        return ((30*1000 - new Date().getTime() % (30*1000) - (30-roundSeconds)*1000)/1 < 0 ? (30*1000 - new Date().getTime() % (30*1000) + roundSeconds*1000)/1 : (30*1000 - new Date().getTime() % (30*1000) - (30-roundSeconds)*1000)/1)
    }

    login(name, password) {
        let body = {
            user: {
                name: name,
                password: password
            }
        }
        api.call('login', 'POST', body).then(res => {
            if (res.user) {
                this.setState({
                    role: res.user.role,
                    name: res.user.name
                })
                api.token = res.user.token;
                $('#loginModal').modal('hide');
            } else {
                if(res.message === 'name and password combination incorrect') {
                    this.setState({loginMsg: 'Nieprawidłowa nazwa użytkownika lub hasło.'});
                }
                else this.setState({loginMsg: res.message});
            }
        });
    }

    register(name, password) {
        let body = {
            user: {
                name: name,
                password: password
            }
        }
        api.call('register', 'POST', body).then(res => {
            if (res.user) {
                this.setState({
                    role: res.user.role,
                    name: res.user.name
                })
                api.token = res.user.token;
                $('#loginModal').modal('hide');
            } else {
                if(res.message === 'name already taken') {
                    this.setState({registerMsg: 'Nazwa użytkownika jest zajęta, wybierz inną.'});
                }
                else this.setState({registerMsg: res.message});
            }
        });
    }

    guest(name) {
        let body = {
            user: {
                name: name
            }
        }
        api.call('registerGuest', 'POST', body).then(res => {
            if (res.user) {
                this.setState({
                    role: 'GUEST',
                    name: name
                })
                api.guestName = name;
                $('#loginModal').modal('hide');
            } else {
                if(res.message === 'name already taken') {
                    this.setState({guestMsg: 'Imię jest zajęte, wybierz inne.'});
                }
                else this.setState({guestMsg: res.message});
            }
        });
    }

    guess(input) {
        let author = this.state.author;
        let title = this.state.title;
        let guessed = this.state.guessed;

        let response = "Próbuj dalej";

        for (let gWord of input.split(" ")) {
            for (const[index, tWords] of title.entries()) {
                for(let tWord of tWords) {
                    if(this.compareWords(gWord, tWord)) {
                        title.splice(index, 1);
                        response = "Brawo, ale potrzeba więcej!";
                        break;
                    }
                }
            }
            for (const[index, aWords] of author.entries()) {
                for(let aWord of aWords) {
                    if(this.compareWords(gWord, aWord)) {
                        author.splice(index, 1);
                        response = "Brawo, ale potrzeba więcej!";
                    }
                }
            }
        }

        if((title.length === 0 && author.length === 0 && guessed !== 'BOTH')
            || (title.length === 0 && guessed === 'ARTIST')
            || (author.length === 0 && guessed === 'TITLE')) {
            response = "Super, wszystko odgadgnięte.";
            guessed = "BOTH";
            this.reportGuessed(guessed);
            window.showPlayer();
        }
        else if (title.length === 0 && guessed !== 'TITLE' && guessed !== 'BOTH') {
            response = "Świetnie, zgadłeś tytuł!";
            guessed = "TITLE";
            this.reportGuessed(guessed);
        }

        else if (author.length === 0 && guessed !== 'TITLE' && guessed !== 'BOTH') {
            response = "Gratulację, odgadłeś wykonawcę!";
            guessed = "ARTIST";
            this.reportGuessed(guessed);
        }

        this.setState({response: response, author: author, title: title, guessed: guessed});
    }

    reportGuessed(guessed) {
        api.call('guessed', 'POST', {guessed: guessed});
    }

    compareWords(word1, word2) {
        word1 = word1.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
        word2 = word2.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
        word1 = word1.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        word2 = word2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        //console.log(word1 + " vs " + word2);
        let distance = levenshteinDistance(word1, word2);
        let allowedDistance = (word2.length-3)/2;
        allowedDistance = allowedDistance < 0 ? 0 : allowedDistance;
        return (distance <= allowedDistance); //amp do usuniecia
    }

    gotIt() {
        this.setState({newSong: false});
    }

    reportGameState(state) {
        let showScore = (state === 'show' && this.state.round === 10);
        this.setState({gameState: state, showScore: showScore});
    }

    render() {
        let loginCallbacks = {
            login: this.login.bind(this),
            register: this.register.bind(this),
            guest: this.guest.bind(this)
        }
        let playerCallbacks = {
            gotIt: this.gotIt.bind(this),
            getDelayTill: this.getDelayTill,
            reportGameState: this.reportGameState.bind(this)
        }
        return (
            <div className="App">
                <Login callbacks={loginCallbacks} loginMsg={this.state.loginMsg} registerMsg={this.state.registerMsg} guestMsg={this.state.guestMsg}/>
                <Score name={this.state.name} show={this.state.showScore} players={this.state.players}/>
                <Header guessed={this.state.guessed} name={this.state.name} role={this.state.role}/>
                <main role="main">
                    <section className="jumbotron text-center">
                        <div className="container">
                            <Player newSong={this.state.newSong} callbacks={playerCallbacks} response={this.state.response} videoId={this.state.videoId} startTime={this.state.startTime} start={35} end={80}/>
                        </div>
                    </section>
                    <Progress guessed={this.state.guessed}/>
                    <div className="album py-7 bg-light">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="card-transaprent mb-4">
                                        <History songs={this.state.songs.slice(1)}/>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card-transparent mb-5">
                                        <div className="card-body">
                                            <Input round={this.state.round} gameState={this.state.gameState} callback={this.guess.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-transparent mb-4">
                                        <Ranking name={this.state.name} role={this.state.role} players={this.state.players}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer/>
            </div>
        )
    }
    update() {
        api.call('update', 'GET').then(res => {
            if (res && res.message && res.message === 'ok') {
                if (res.songs) {
                    this.setState({songs: res.songs});
                    this.updateSongState();
                }
                if (res.players) this.setState({players: res.players});
                if (res.round) this.setState({round: res.round});
            }
            this.update();
        });
    }

    componentDidMount() {
        this.getPlayers();
        this.getSongs();
        this.update();
    }

    getPlayers() {
        api.call('players', 'GET').then(res => {
            if(res.message && res.message === 'ok') {
                this.setState({players: res.players});
            }
        });
    }

    getSongs() {
        api.call('songs', 'GET').then(res => {
            if(res.message && res.message === 'ok') {
                this.setState({songs: res.songs});
                this.updateSongState();
            }
        });
    }

    updateSongState() {
        if(this.state.songs.length < 1) return;
        let result = {
            wykonawca: this.state.songs[0].artist,
            tytul: this.state.songs[0].title,
            videoID: this.state.songs[0].videoId
        }
        if(result.videoID !== this.state.videoId) {
            result.wykonawca = result.wykonawca.replace(/ ft | feat | and | & | ft. | i /gi, " ")
            let author = result.wykonawca.split(" ").filter(Boolean);
            author.forEach((word, index, arr) => {
                arr[index] = word.split("|")
            });
            result.tytul = result.tytul.replace(/ ft | feat | ft. | and | & | i /gi, " ")
            let title = result.tytul.split(" ").filter(Boolean);
            title.forEach((word, index, arr) => {
                arr[index] = word.split("|")
            });
            this.setState({newSong: true, "videoId": result.videoID, "title": title, "author": author, guessed: "none", progress: 0, startTime: this.state.songs[0].startTime});
        }
    }
}

export default Client;
