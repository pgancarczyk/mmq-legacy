import React, {Component} from 'react'
import YouTube from 'react-youtube'

class Player extends Component {
    render() {
        const opts = {
            height: '385',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                html5: 1,
                frameborder: 0,
                autoplay: 1,
                border: 0,
                cc_load_policy: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                hd: 1,
                playsinline: 1,
                iv_load_policy: 3,
                modestbranding: 1,
                origin: window.location.protocol + "//localhost:3000",
                playerapiid: "player",
                rel: 0,
                showinfo: 0,
                showsearch: 0,
                start: this.props.start,
                end: this.props.end
            }
        };

        return (
            <div>
                <YouTube id="player"
                    videoId={this.props.videoId}
                    opts={opts}
                    onReady={this.onReady}
                    onPause={function(e){e.target.playVideo()}}
                    onStateChange={this.onStateChange}
                />
                <div id="response"><h1 className="text-light">{this.props.response}</h1></div>
            </div>
        );
    }

    onReady(event) {
        window.hidePlayer = function() {
            document.getElementById("player").style.visibility = "hidden";
            document.getElementById("response").style.display = "inline-block";
        }
        window.showPlayer = function() {
            document.getElementById("response").style.display = "none";
            document.getElementById("player").style.visibility = "visible";
        }
        event.target.playVideo();
        window.hidePlayer();
    }

    onStateChange(event) {
        switch(event.data) {
            case 0: // ended
                window.showPlayer();
                break;
            case -1: // loaded
                window.hidePlayer();
                window.silence = new Audio('silence.mp3');
                window.silence.loop = true;
                window.rick();
                break;
            case 1: // playing
                window.silence.play();
                window.hidePlayer();
                break;
        }
    }
}

export default Player;