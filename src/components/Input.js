import React, {Component} from 'react'

class Input extends Component {
    render() {
        return(
            <div className="card-body input">
                <input disabled={this.props.gameState !== 'playing'} onKeyPress={this.handleEnter.bind(this)} className="form-control form-control-lg" type="text" placeholder={this.props.gameState !== 'playing' ? "czekaj na następny utwór" : "wpisz propozycję i naciśnij [ENTER]"}/>
                <div className="d-flex justify-content-between align-items-center"></div>
                <small className="text-muted">pozostało 14s</small>
            </div>
        )
    }

    handleEnter(event) {
        if (event.key === 'Enter') {
            this.props.callback(event.target.value);
            event.target.value = "";
        }
    }
}

export default Input;