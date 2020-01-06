import React, {Component} from 'react'
import Header from "../Header";
import Nav from "./Nav";
import Songs from "./Songs";
import Users from "./Users";
import Footer from "../Footer";
const api = require('../../scripts/api');

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'songs',
            users: [],
            songs: [],
            songsPage: 1,
            usersPage: 1,
            noSongs: 0,
            noUsers: 0,
            songSearch: '',
            userSearch: '',
        }
        api.token = this.props.token;
    }

    editSong(id, song) {
        api.call('admin/song/'+id, 'PUT', song).then(res => {
            if (res.message && res.message === 'ok') {
                let songs = this.state.songs;
                let index = songs.findIndex(song => song.id === id);
                songs[index] = res.song;
                this.setState({songs: songs});
            }
        });
    }

    deleteSong(id) {
        api.call('admin/song/'+id, 'DELETE').then(res => {
            if (res.message && res.message === 'ok') {
                this.getSongs(this.state.songsPage);
                /*let songs = this.state.songs;
                let index = songs.findIndex(song => song.id === id);
                songs.splice(index, 1);
                this.setState({songs: songs});*/
            }
        });
    }

    newSong(song) {
        api.call('admin/song/', 'POST', song).then(res => {
            if (res.message && res.message === 'ok') {
                let lastPage = Math.ceil((this.state.noSongs+1)/10);
                this.setState({songsPage: lastPage, new: 'none'});
                this.getSongs(lastPage);
            }
        });
    }

    setSongsPage(page) {
        this.setState({songsPage: page});
        this.getSongs(page);
    }

    getSongs(page) {
        let resource = 'admin/songs/'+page;
        let search = this.state.songSearch;
        if (search && search.trim() !== '') resource += '/' + encodeURIComponent(search);

        api.call(resource, 'GET').then(res => {
            if (res.message && res.message === 'ok') {
                this.setState({
                    songs: res.list.rows,
                    noSongs: res.list.count
                });
            }
        });
    }

    searchSong(value) {
        this.setState({songSearch: value, songsPage: 1});
        this.getSongs(1);
    }

    editUser(id, user, password) {
        api.call('admin/user/'+id, 'PUT', {user: user, password: password}).then(res => {
            if (res.message && res.message === 'ok') {
                let users = this.state.users;
                let index = users.findIndex(user => user.id === id);
                users[index] = res.user;
                this.setState({users: users});
            }
        });
    }

    deleteUser(id) {
        api.call('admin/user/'+id, 'DELETE').then(res => {
            if (res.message && res.message === 'ok') {
                this.getUsers(this.state.usersPage);
            }
        });
    }

    newUser(user, password) {
        api.call('admin/user/', 'POST', {user: user, password: password}).then(res => {
            if (res.message && res.message === 'ok') {
                let lastPage = Math.ceil((this.state.noUsers+1)/10);
                this.setState({usersPage: lastPage, new: 'none'});
                this.getUsers(lastPage);
            }
        });
    }

    setUsersPage(page) {
        this.setState({usersPage: page});
        this.getUsers(page);
    }

    getUsers(page) {
        let resource = 'admin/users/'+page;
        let search = this.state.userSearch;
        if (search && search.trim() !== '') resource += '/' + encodeURIComponent(search);

        api.call(resource, 'GET').then(res => {
            if (res.message && res.message === 'ok') {
                this.setState({
                    users: res.list.rows,
                    noUsers: res.list.count
                });
            }
        });
    }

    searchUser(value) {
        this.setState({userSearch: value, usersPage: 1});
        this.getUsers(1);
    }

    switchTab(tab) {
        if (tab === 'users') this.getUsers(this.state.usersPage);
        if (tab === 'songs') this.getSongs(this.state.songsPage);
        this.setState({tab: tab});
    }

    render() {
        let songCallbacks = {
            setPage: this.setSongsPage.bind(this),
            editSong: this.editSong.bind(this),
            deleteSong: this.deleteSong.bind(this),
            newSong: this.newSong.bind(this),
            searchSong: this.searchSong.bind(this),
        };

        let userCallbacks = {
            setPage: this.setUsersPage.bind(this),
            editUser: this.editUser.bind(this),
            deleteUser: this.deleteUser.bind(this),
            newUser: this.newUser.bind(this),
            searchUser: this.searchUser.bind(this),
        };

        return(
            <div id="content">
                <Header/>
                <div className="container-fluid">
                    <div className="row">
                        <Nav current={this.state.tab} callback={this.switchTab.bind(this)}/>
                        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                            <div
                                className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                                <h1 className="h2">{this.state.tab === 'songs' ? 'Utwory' : 'Użytkownicy'}</h1>
                                <div className="btn-toolbar mb-2 mb-md-0">
                                    <div className="btn-group mr-2">
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.setState({new: this.state.tab})}>Nowy</button>
                                    </div>
                                </div>
                            </div>
                            <div id="tabConent">
                                {this.state.tab === 'songs' ?
                                    <Songs new={this.state.new === 'songs'} callbacks={songCallbacks} page={this.state.songsPage} count={this.state.noSongs} list={this.state.songs}/>
                                    :
                                    <Users new={this.state.new === 'users'} callbacks={userCallbacks} page={this.state.usersPage} count={this.state.noUsers} list={this.state.users}/>
                                }
                            </div>
                        </main>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

    componentDidMount() {
        this.getSongs(1);
    }
}

export default Content;