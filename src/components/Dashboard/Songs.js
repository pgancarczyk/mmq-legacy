import React, {Component} from 'react';
import EditSong from "./EditSong";

class Songs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedSong: null,
            search: '',
        }
        this.timer = null;
    }

    goto(page) {
        this.props.callbacks.setPage(page);
    }

    edit(newSong) {
        let newValues = {
            title: newSong.title.value,
            artist: newSong.artist.value,
            videoId: newSong.videoId.value,
            status: newSong.status.value,
            source: newSong.source.value,
        };
        this.props.callbacks.editSong(this.state.editedSong.id, newValues);
    }

    new(newSong) {
        let newValues = {
            title: newSong.title.value,
            artist: newSong.artist.value,
            videoId: newSong.videoId.value,
            status: newSong.status.value,
            source: newSong.source.value,
        };
        this.props.callbacks.newSong(newValues);
        this.setState({editedSong: null});
    }

    delete(song) {
        this.props.callbacks.deleteSong(song.id);
        this.setState({editedSong: null});
    }

    showEditModal(song) {
        this.setState({editedSong: song});
    }

    closeEditModal(song) {
        this.setState({editedSong: null});
    }

    handleSearch(e) {
        clearTimeout(this.timer);
        this.setState({search: e.target.value});
        this.timer = setTimeout(this.search.bind(this), 500);
    }

    search() {
        this.props.callbacks.searchSong(this.state.search);
    }

    render() {
        let cur = this.props.page;
        let all = Math.ceil(this.props.count/10);
        let editedSong = this.state.editedSong;
        if (this.props.new) editedSong = {
            id: 0,
            videoId: null,
            source: 'dashboard',
            status: 'NEW'
        };

        let modalCallbacks = {
            close: this.closeEditModal.bind(this),
            new: this.new.bind(this),
            edit: this.edit.bind(this),
            delete: this.delete.bind(this)
        };

        return(
            <div>
                <EditSong callbacks={modalCallbacks} song={editedSong} />
                <div className="table-responsive table-hover">
                    <table className="table table-striped table-sm">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Wykonawca</th>
                            <th>Tytuł</th>
                            <th>YouTube video ID</th>
                            <th>Status</th>
                            <th>Źródło</th>
                            <th>Data utworzenia</th>
                            <th>Data edycji</th>
                            <th>#</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.list.map(song => {
                            return (
                                <tr key={"song"+song.id}>
                                    <td>{song.id}</td>
                                    <td>{song.artist}</td>
                                    <td>{song.title}</td>
                                    <td>{song.videoId}</td>
                                    <td>{song.status}</td>
                                    <td>{song.source}</td>
                                    <td>{song.createdAt}</td>
                                    <td>{song.updatedAt}</td>
                                    <td>
                                        <div className="btn-group mr-2 btn-group-sm">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.showEditModal(song)}>Edytuj</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.delete(song)}>Usuń</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <input id="search" onChange={this.handleSearch.bind(this)} className="md-form form-control justify-content-start col" type="text" placeholder="wyszukaj"/>
                    <ul className="pagination justify-content-end col">
                        <li className="page-item"><a onClick={() => this.goto(1)} className="page-link" href="#">1 ...</a></li>
                        { cur-1 >= 1 && <li className="page-item"><a onClick={() => this.goto(cur-1)} className="page-link" href="#">{cur-1}</a></li>}
                        <li className="page-item active"><span className="page-link">{cur}</span></li>
                        { cur+1 <= all && <li className="page-item"><a onClick={() => this.goto(cur+1)} className="page-link" href="#">{cur+1}</a></li>}
                        <li className="page-item"><a onClick={() => this.goto(all)} className="page-link" href="#">... {all}</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Songs;