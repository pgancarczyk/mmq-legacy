import React, {Component} from 'react'
import YouTube from 'react-youtube'

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameState: 'new',
            response: ''
        };
        this.getDelayTill = this.props.callbacks.getDelayTill;
    }

    render() {
        const opts = {
            height: '385',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                html5: 1,
                frameborder: 0,
                autoplay: 0,
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
                start: 35,
                end: 70
            }
        };

        return (
            <div>
                <YouTube id="player"
                    videoId="9rJoB7y6Ncs"
                    opts={opts}
                    onReady={this.onReady.bind(this)}
                    //onPause={function(e){e.target.playVideo()}}
                    onStateChange={this.onStateChange.bind(this)}
                         //onError={function(e){console.log(e)}}
                />
                <div id="response"><h1 className="text-light">{this.state.response}</h1></div>
                {/*<h1>{this.state.gameState}</h1>*/}
            </div>
        );
    }

    onReady(event) {
        this.player = event.target;
    }

    onStateChange(event) {
        switch(event.data) {
            case 0: // ended
                //window.showPlayer();
                break;
            case -1: // loaded
                //window.hidePlayer();
                window.silence = new Audio('silence.mp3');
                window.silence.loop = true;
                window.rick();
                break;
            case 1: // playing
                window.silence.play();
                //window.hidePlayer();
                if (this.state.gameState === 'buffering') {
                    this.player.pauseVideo();
                }
                break;
            case 3:
                break;
            default:
                // do nothing
        }
    }

    handleGame() {
        this.setState({gameState: 'buffering', response: "Przygotuj się."});
        this.props.callbacks.reportGameState('buffering');
        window.hidePlayer();
        if (this.player) {
            this.player.mute();
            this.player.loadVideoById({
                videoId: this.props.videoId,
                startSeconds: 30
            });
            this.player.playVideo();
            this.buffering = true;
            window.player = this.player;
        }
        setTimeout(() => {
            this.setState({gameState: 'playing', response: "START!"});
            this.props.callbacks.reportGameState('playing');
            this.player.unMute();
            this.player.playVideo();
            setTimeout(() => {
                this.setState({gameState: 'show'});
                this.props.callbacks.reportGameState('show');
                this.showTime = new Date();
                window.showPlayer();
            }, this.getDelayTill(25));
        }, this.getDelayTill(5));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.response !== this.props.response) this.setState({response: this.props.response});
        if (this.props.newSong && this.state.gameState !== 'new') {
            this.props.callbacks.gotIt();
            this.handleGame();
        }
    }

    componentDidMount() {
        setTimeout(this.handleGame.bind(this), this.getDelayTill(0));
        window.hidePlayer = function() {
            document.getElementById("player").style.visibility = "hidden";
            document.getElementById("response").style.display = "inline-block";
        }
        window.showPlayer = function() {
            document.getElementById("response").style.display = "none";
            document.getElementById("player").style.visibility = "visible";
        }
    }
}

export default Player;