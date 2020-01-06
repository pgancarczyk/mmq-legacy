import React, {Component} from 'react';
import YouTube from 'react-youtube';

class EditSong extends Component {
    edit(e) {
        e.preventDefault();
        this.props.callbacks.edit(e.target);
    }
    
    delete() {
        this.props.callbacks.delete(this.props.song);
        window.$('#editSongModal').modal('hide');
    }

    new(e) {
        e.preventDefault();
        this.props.callbacks.new(e.target);
        window.$('#editSongModal').modal('hide');
    }

    close() {
        this.props.callbacks.close();
        window.$('#editSongModal').modal('hide');
    }

    render() {
        let song = this.props.song;

        let opts = {
            height: '190',
            width: '320',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                html5: 1,
                frameborder: 0,
                autoplay: 1,
                border: 0,
                cc_load_policy: 0,
                controls: 1,
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

        if(!song) return(<div></div>);

        return(
            <div className="modal fade" id="editSongModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <form onSubmit={song.videoId ? this.edit.bind(this) : this.new.bind(this)}>
                                {song.videoId && <YouTube videoId={song.videoId} opts={opts}/>}
                                <div className="form-group">
                                    <label>Tytuł:</label>
                                    <input className="form-control" type="text" name="title" defaultValue={song.title} required/>
                                </div>
                                <div className="form-group">
                                    <label>Wykonawca:</label>
                                    <input className="form-control" type="text" name="artist" defaultValue={song.artist} required/>
                                </div>
                                <div className="form-group">
                                    <label>YouTube video ID:</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">http://youtube.com/watch?=</span>
                                        </div>
                                        <input className="form-control" type="text" name="videoId" defaultValue={song.videoId} required/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Status:</label>
                                    <select className="form-control" name="status" defaultValue={song.status}>
                                        <option value="NEW">nowy</option>
                                        <option value="ENABLED">włączony</option>
                                        <option value="DISABLED">wyłączony</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Źródło utworu:</label>
                                    <input className="form-control" type="text" name="source" defaultValue={song.source} required/>
                                </div>
                                <button className="btn btn-success btn-block" type="submit">Zapisz</button>
                                {song.videoId && <button className="btn btn-danger btn-block" onClick={this.delete.bind(this)} type="button">Usuń</button>}
                                <button className="btn btn-info btn-block" type="button" onClick={this.close.bind(this)}>Zamknij</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        window.$('#editSongModal').modal();
    }
}

export default EditSong;