import React, {Component} from 'react'
import $ from 'jquery';

class Login extends Component {
    login(e) {
        e.preventDefault();
        this.props.callbacks.login(e.target.inputLoginName.value, e.target.inputLoginPassword.value);
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
                                <p className="loginMsg text-danger">{this.props.msg}</p>
                            </div>
                            <div className="carousel-item">
                                <form className="form-login">
                                    <h1 className="h4 mb-4 font-weight-normal">zarejestruj się</h1>
                                    <input type="text" name="inputRegisterName" className="form-control"
                                           placeholder="nazwa użytkownika" required autoFocus/>
                                    <input type="password" name="inputRegisterPassword" className="form-control"
                                           placeholder="hasło" required/>
                                    <div className="checkbox mb-3">
                                    </div>
                                    <button className="btn btn-success btn-block" type="button" data-dismiss="modal">zarejestruj</button>
                                </form>
                            </div>
                            <div className="carousel-item">
                                <form className="form-guest">
                                    <h1 className="h4 mb-4 font-weight-normal">graj jako gość</h1>
                                    <input type="text" name="inputGuest" className="form-control"
                                           placeholder="imię" required autoFocus/>
                                    <div className="checkbox mb-3">
                                    </div>
                                    <button className="btn btn-success btn-block" type="button" data-dismiss="modal">kontynuuj</button>
                                </form>
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