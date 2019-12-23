import React, {Component} from 'react';
import Player from "./Player";
import Header from "./Header";
import Ranking from "./Ranking";
import Input from "./Input";
import Footer from "./Footer";
import History from "./History";
import Progress from "./Progress";
import levenshteinDistance from "../scripts/levenshteinDistance";
import Login from "./Login";
import $ from 'jquery';
const api = require('../scripts/api');

class Client extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: " ",
            progress: 0,
            guessed: "none",
            title: [["swan"], ["lake"]],
            author: [["tchaikovsky"]],
            videoId: "", // "9rJoB7y6Ncs",
            role: "",
            name: "",
            loginMsg: " "
        }
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

        if(title.length === 0 && author.length === 0) {
            response = "Super, wszystko odgadgnięte.";
            guessed = "both";
            window.showPlayer();
        }
        else if (title.length === 0) {
            response = "Świetnie, zgadłeś tytuł!";
            guessed = "title";
        }

    else if (author.length === 0) {
            response = "Gratulację, odgadłeś wykonawcę!";
            guessed = "author";
        }

        this.setState({response: response, author: author, title: title, guessed: guessed});
    }

  compareWords(word1, word2) {
      word1 = word1.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
      word2 = word2.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
      word1 = word1.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      word2 = word2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      console.log(word1 + " vs " + word2);
      let distance = levenshteinDistance(word1, word2);
      let allowedDistance = (word2.length-3)/2;
      allowedDistance = allowedDistance < 0 ? 0 : allowedDistance;
      return (distance <= allowedDistance); //amp do usuniecia
  }

  getRandVideo() {
    fetch("http://localhost:5000/api", {mode: "cors"})
        .then(res => res.json())
        .then(
            (result) => {
                result.wykonawca = result.wykonawca.replace(/ ft | feat | and | & | ft. | i /gi, " ")
                let author = result.wykonawca.split(" ").filter(Boolean);
                author.forEach((word, index, arr) => {arr[index] = word.split("|")});
                result.tytul = result.tytul.replace(/ ft | feat | ft. | and | & | i /gi, " ")
                let title = result.tytul.split(" ").filter(Boolean);
                title.forEach((word, index, arr) => {arr[index] = word.split("|")});
                this.setState({"videoId": result.videoID, "title": title, "author": author, guessed: "none", progress: 0});
            });
    setTimeout(this.getRandVideo.bind(this), 30*1000);
  }

  render() {
      let loginCallbacks = {
          login: this.login.bind(this)
      }
      return (
          <div className="App">
              <Login callbacks={loginCallbacks} msg={this.state.loginMsg}/>
              <Header guessed={this.state.guessed}/>
              <main role="main">
                  <section className="jumbotron text-center">
                      <div className="container">
                          <Player response={this.state.response} videoId={this.state.videoId} start={30} end={30}/>
                      </div>
                  </section>
                  <Progress progress={this.state.progress} guessed={this.state.guessed}/>
                  <div className="album py-7 bg-light">
                      <div className="container">
                          <div className="row">
                              <div className="col">
                                  <div className="card-transaprent mb-4">
                                      <History/>
                                  </div>
                              </div>
                              <div className="col-6">
                                  <div className="card-transparent mb-5">
                                      <div className="card-body">
                                          <Input callback={this.guess.bind(this)}/>
                                      </div>
                                  </div>
                              </div>
                              <div className="col">
                                  <div className="card-transparent mb-4">
                                      <Ranking/>
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

  updateProgress() {
      let progress = this.state.progress;
      progress++;
      if (progress > 100) progress = 0;
      this.setState({progress: progress});
  }

  componentDidMount() {
      //this.getRandVideo();
      setInterval(this.updateProgress.bind(this), 30*1000/100);
  }
}

export default Client;
