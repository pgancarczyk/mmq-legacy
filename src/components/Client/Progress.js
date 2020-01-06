import React, {Component} from 'react'

class Progress extends Component {
    constructor(props) {
        super(props);
        this.width = 100;
        setInterval(this.update.bind(this), 100);
    }

    render() {
        let bg;
        switch (this.props.guessed) {
            case "BOTH":
                bg = "bg-warning";
                break;
            case "TITLE":
                bg = "bg-info";
                break;
            case "ARTIST":
                bg = "bg-success";
                break;
            default:
                bg = "bg-danger";
        }
        let width = { "width": this.width+"%" };

        return(
            <div className="progress">
                <div id="progressbar" className={"progress-bar progress-bar-striped progress-bar-animated "+bg} role="progressbar"
                     aria-valuenow={this.width} aria-valuemin="0" aria-valuemax="100" style={width}></div>
            </div>
        )
    }

    update() {
        let d = new Date();
        let width = ((d.getSeconds() % 30 - 5)*1000 + d.getMilliseconds())/(20*10);
        width = Math.max(Math.min(width, 100), 0);
        window.$('#progressbar').attr('aria-valuenow', width).css('width', width+'%');
        this.width = width;
    }
}

export default Progress;