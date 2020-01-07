import React, {Component} from 'react'

class Input extends Component {
    render() {
        let rounds = 11-this.props.round;
        let pluralSongs;
        if (rounds === 1) pluralSongs = "utwór";
        else if (rounds < 5) pluralSongs = "utwory";
        else pluralSongs = "utworów";
        let pluralLeft;
        if (rounds === 1) pluralLeft = "pozostał";
        else if (rounds < 5) pluralLeft = "pozostały";
        else pluralLeft = "pozostało";
        return(
            <div className="card-body input">
                <input disabled={this.props.gameState !== 'playing'} onKeyPress={this.handleEnter.bind(this)} className="form-control form-control-lg" type="text" placeholder={this.props.gameState !== 'playing' ? "czekaj na następny utwór" : "wpisz propozycję i naciśnij enter"}/>
                <div className="d-flex justify-content-between align-items-center"></div>
                <small className="text-muted">{pluralLeft} {rounds} {pluralSongs} do podsumowania wyników</small>
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