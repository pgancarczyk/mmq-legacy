import React, {Component} from 'react'

class Input extends Component {
    render() {
        let rounds = 11-this.props.round;
        let plurals = (rounds) => {
            if (rounds === 1) return "pozostał 1 utwór";
            if (rounds < 5) return "pozostały " + rounds + " utwory";
            return "pozostało " + rounds + " utworów";
        };
        return(
            <div className="card-body input">
                <input disabled={this.props.gameState !== 'playing'} onKeyPress={this.handleEnter.bind(this)} className="form-control form-control-lg" type="text" placeholder={this.props.gameState !== 'playing' ? "czekaj na następny utwór" : "wpisz propozycję i naciśnij enter"}/>
                <div clasName="d-flex justify-content-between align-items-center"></div>
                <small className="text-muted">{plurals(rounds)} do podsumowania wyników</small>
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