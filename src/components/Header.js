import React, {Component} from 'react'

class Header extends Component {
    render() {
        let color;
        switch (this.props.guessed) {
            case "none":
                color = "text-light";
                break;
            case "both":
                color = "text-warning";
                break;
            case "title":
                color = "text-info";
                break;
            case "author":
                color = "text-success";
                break;
        }

        return(
            <header>
                <div className="collapse bg-dark" id="navbarHeader">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-8 col-md-7 py-4">
                                <h4 className="text-white">O projekcie</h4>
                                <p className="text-muted">Aplikacja jest częścią pracy inżynierskiej "Wieloosobowy quiz muzyczny".
                                    Oferuje rozgrywkę w postaci odgadywania utworów i rywalizycji z innymi zgadującymi. Została
                                    napisana przy użyciu technologii node.js, Express.js, React, Bootstrap oraz JQuery.</p>
                            </div>
                            <div className="col-sm-4 offset-md-1 py-4">
                                <h4 className="text-white">Autor</h4>
                                <ul className="list-unstyled">
                                    <li className="text-muted">Paweł Gancarczyk</li>
                                    <li><a href="mailto:pawel.gancarczyk@gmail.com"
                                           className="text-white">pawel.gancarczyk@gmail.com</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navbar navbar-dark bg-dark shadow-sm">
                    <div className="container d-flex justify-content-between">
                        <a href="#" className={"navbar-brand d-flex align-items-center "+color}>
                            <strong>mmq</strong>
                        </a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader"
                                aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="font-italic">i</span>
                        </button>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;