import React, {Component} from 'react'
import $ from "jquery";

class Ranking extends Component {
    registerModal() {
        $('#loginModal').modal();
        $('#carouselModal').carousel(1);
    }

    render() {
        return(
            <div className="card-body">
                <h4>Ranking graczy</h4>
                <ol className="card-text list-unstyled">
                    {this.props.players.map(player => {
                        let color;
                        let pointsAdded;
                        switch(player.guessed) {
                            case "BOTH":
                                color = "warning";
                                pointsAdded = 3;
                                break;
                            case "TITLE":
                                color = "info";
                                pointsAdded = 1;
                                break;
                            case "ARTIST":
                                color = "success";
                                pointsAdded = 1;
                                break;
                            default:
                                color = "dark";
                                pointsAdded = 0;
                        }
                        return(
                            <li key={player.name}>
                                <span className={"badge badge-pill badge-" + color}> {player.score}pkt.</span>
                                <span className={player.isUser ? "" : "text-dark"}> {player.name} </span>
                                {pointsAdded ? <span className={"text-" + color}>+{pointsAdded}</span> : ""}
                            </li>
                        )
                    })}
                </ol>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                        {/*<button type="button" className="btn btn-sm btn-outline-secondary">zmień imię</button>*/}
                        {this.props.role === 'GUEST' && <button type="button" onClick={this.registerModal.bind(this)} className="btn btn-sm btn-outline-secondary">zarejestruj</button>}
                    </div>
                </div>
            </div>
        )
    }
}

export default Ranking;