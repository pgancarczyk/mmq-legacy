import React, {Component} from 'react'

class Ranking extends Component {
    render() {
        return(
            <div className="card-body">
                <h4>Ranking graczy</h4>
                <ol className="card-text list-unstyled">
                    {/*<li className="font-weight-bold"><span className="badge badge-success badge-pill">14pkt.</span> konf <span className="text-success">+1</span></li>
                    <li><span className="badge badge-dark badge-pill">12pkt.</span> gość 145</li>
                    <li><span className="badge badge-warning badge-pill">7pkt.</span> ansz <span className="text-warning">+3</span></li>
                    <li><span className="badge badge-dark badge-pill">0pkt.</span> gość 69</li>
                    <li><span className="badge badge-dark badge-pill">0pkt.</span> kacor</li>*/}
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
                        <button type="button" className="btn btn-sm btn-outline-secondary">zmień imię</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">zarejestruj</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Ranking;