import React, {Component} from 'react'
import $ from "jquery";
//import $ from "jquery";

class Score extends Component {
    render() {
        return(
            <div id="scoreModal" className="modal" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-sm" role="document">
                    <div className="modal-content modal-body">
                        <h2 className="modal-title">Koniec rundy</h2>
                        <ol className="list-score card-text">
                            {this.props.players.map((player, index) => {
                                return(
                                    <li key={player.name}>
                                        <span className={"badge badge-pill badge-"+(index ? "dark" : "warning")}> {player.score}pkt.</span>
                                        <span className={(player.name === this.props.name && "font-weight-bold ")+(player.isUser && "text-dark")}> {player.name} </span>
                                    </li>
                                )
                            })}
                        </ol>
                        <button type="button" className="btn btn-info" data-dismiss="modal">Zamknij</button>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        if(this.props.show) $('#scoreModal').modal();
    }
}

export default Score;