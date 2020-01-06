import React, {Component} from 'react'
import '../scripts/dashboard.css';
import Login from './Dashboard/Login';
import Content from "./Dashboard/Content";
import $ from 'jquery';
const api = require('../scripts/api');

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            role: '',
            name: '',
            loginMsg: '',
            token: '',
        };
    }

    login(name, password, remember) {
        let body = {
            user: {
                name: name,
                password: password
            },
            remember: remember
        }
        api.call('login', 'POST', body).then(res => {
            if (res.user) {
                if (res.user.role !== 'USER') {
                    $('#loginModal').modal('hide');
                    this.setState({
                        auth: true,
                        name: res.user.name,
                        role: res.user.role,
                        token: res.user.token,
                    });
                }
                else {
                    this.setState({loginMsg: 'Brak uprawnień.'});
                }
            } else {
                if(res.message === 'name and password combination incorrect') {
                    this.setState({loginMsg: 'Nieprawidłowa nazwa użytkownika lub hasło.'});
                }
                else this.setState({loginMsg: res.message});
            }
        });
    }

    render() {
        let callbacks = {
            login: this.login.bind(this)
        }
        return(
            <div className="App">
                {this.state.auth ? <Content name={this.state.name} role={this.state.role} token={this.state.token}/> : <Login loginMsg={this.state.loginMsg} callbacks={callbacks}/>}
            </div>
        )
    }

    remember() {
        api.call('remember', 'GET').then(res => {
            if (res.user) {
                if (res.user.role !== 'USER') {
                    $('#loginModal').modal('hide');
                    this.setState({
                        auth: true,
                        name: res.user.name,
                        role: res.user.role,
                        token: res.user.token,
                    });
                }
            }
        });
    }

    componentDidMount() {
        //this.remember();
    }
}

export default Dashboard;