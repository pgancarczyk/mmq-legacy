import React, {Component} from 'react'

class Nav extends Component {
    goToUsers()  {
        this.props.callback('users');
    }

    goToSongs() {
        this.props.callback('songs');
    }

    render() {
        return(
            <nav className="col-md-2 d-none d-md-block sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a onClick={this.goToSongs.bind(this)} className={"nav-link" + (this.props.current === 'songs' ? ' active' : '')} href="#songs">
                                Utwory
                            </a>
                        </li>
                        <li className="nav-item">
                            <a onClick={this.goToUsers.bind(this)} className={"nav-link" + (this.props.current === 'users' ? ' active' : '')} href="#users">
                                Użytkownicy
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Nav;