import React, {Component} from 'react'
import $ from 'jquery';

class Login extends Component {
    login(e) {
        e.preventDefault();
        this.props.callbacks.login(e.target.inputLoginName.value, e.target.inputLoginPassword.value);
    }

    register(e) {
        e.preventDefault();
        this.props.callbacks.register(e.target.inputRegisterName.value, e.target.inputRegisterPassword.value);
    }

    guest(e) {
        e.preventDefault();
        this.props.callbacks.guest(e.target.inputGuestName.value);
    }

    render() {
        return(
            <div className="modal fade" id="loginModal" data-backdrop="static" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div id="carouselModal" className="modal-content carousel slide" data-interval="false" data-keyboard="false">
                        <div className="modal-body text-center carousel-inner">
                            <div className="carousel-item active">
                                <form className="form-login" onSubmit={this.login.bind(this)}>
                                    <h1 className="h4 mb-4 font-weight-normal">zaloguj się</h1>
                                    <input type="text" name="inputLoginName" className="form-control"
                                           placeholder="nazwa użytkownika" required autoFocus/>
                                    <input type="password" name="inputLoginPassword" className="form-control"
                                           placeholder="hasło" required/>
                                    <div className="checkbox mb-3">
                                        <label>
                                            <input type="checkbox" name="remember" value="remember"/> zapamiętaj
                                        </label>
                                    </div>
                                    <button className="btn btn-success btn-block" type="submit">zaloguj</button>
                                </form>
                                <p className="loginMsg text-danger">{this.props.loginMsg ? this.props.loginMsg : '\u00A0'}</p>
                            </div>
                            <div className="carousel-item">
                                <form className="form-login" onSubmit={this.register.bind(this)}>
                                    <h1 className="h4 mb-4 font-weight-normal">zarejestruj się</h1>
                                    <input type="text" name="inputRegisterName" className="form-control"
                                           placeholder="nazwa użytkownika" required autoFocus/>
                                    <input type="password" name="inputRegisterPassword" className="form-control"
                                           placeholder="hasło" required/>
                                    <div className="checkbox mb-3">
                                    </div>
                                    <button className="btn btn-success btn-block" type="submit" >zarejestruj</button>
                                </form>
                                <p className="loginMsg text-danger">{this.props.registerMsg ? this.props.registerMsg : '\u00A0'}</p>
                            </div>
                            <div className="carousel-item">
                                <form className="form-guest" onSubmit={this.guest.bind(this)}>
                                    <h1 className="h4 mb-4 font-weight-normal">graj jako gość</h1>
                                    <input type="text" name="inputGuestName" className="form-control"
                                           placeholder="imię" required autoFocus/>
                                    <div className="checkbox mb-3">
                                    </div>
                                    <button className="btn btn-success btn-block" type="submit">kontynuuj</button>
                                </form>
                                <p className="loginMsg text-danger">{this.props.guestMsg ? this.props.guestMsg : '\u00A0'}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a href="#carouselModal" data-slide-to="0">
                                <button type="button" className="btn btn-sm btn-info">zaloguj się</button>
                            </a>
                            <a href="#carouselModal" data-slide-to="1">
                                <button type="button" className="btn btn-sm btn-info">zarejestruj</button>
                            </a>
                            <a href="#carouselModal" data-slide-to="2">
                                <button type="button" className="btn btn-sm btn-info">graj jako gość</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        $('#loginModal').modal();
    }
}

export default Login;