import React, {Component} from 'react'

class History extends Component {
    render() {
        return(
            <div className="card-body history">
                <h4>Historia utworów</h4>
                <ul className="card-text list-unstyled">
                    {/*<li className="text-success">odgadnięty wykonawca</li>
                    <li className="text-warning">odagnięty komplet</li>
                    <li>nieodagnięty</li>
                    <li>nieodagnięty</li>
                    <li className="text-info">odgadnięty tytuł</li>
                    <li>nieodagnięty</li>
                    <li className="font-weight-bold">grany teraz</li>*/}
                    {this.props.songs.map(song => {
                        return <li key={song.startTime+"-"+song.videoId}>{song.artist} - {song.title}</li>
                    })}
                </ul>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                        <button type="button" className="btn btn-sm btn-outline-secondary">zgłoś błąd</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default History;