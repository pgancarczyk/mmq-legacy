import React, {Component} from 'react'

class Progress extends Component {
    render() {
        let bg;
        switch (this.props.guessed) {
            case "both":
                bg = "bg-warning";
                break;
            case "title":
                bg = "bg-info";
                break;
            case "author":
                bg = "bg-success";
                break;
            default:
                bg = "bg-danger";
        }
        let width = { "width": this.props.progress+"%" };

        return(
            <div className="progress">
                <div className={"progress-bar progress-bar-striped progress-bar-animated "+bg} role="progressbar"
                     aria-valuenow={this.props.progress} aria-valuemin="0" aria-valuemax="100" style={width}></div>
            </div>
        )
    }
}

export default Progress;