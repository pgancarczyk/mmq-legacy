import React, {Component} from 'react';
import EditUser from "./EditUser";

class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editedUser: null,
            search: '',
        }
        this.timer = null;
    }

    goto(page) {
        this.props.callbacks.setPage(page);
    }

    edit(newUser) {
        let newValues = {
            name: newUser.name.value,
            role: newUser.role.value,
        };
        let password = newUser.password.value;
        this.props.callbacks.editUser(this.state.editedUser.id, newValues, password);
    }

    new(newUser) {
        let newValues = {
            name: newUser.name.value,
            role: newUser.role.value,
        };
        let password = newUser.password.value;
        this.props.callbacks.newUser(newValues, password);
        this.setState({editedUser: null});
    }

    delete(user) {
        this.props.callbacks.deleteUser(user.id);
        this.setState({editedUser: null});
    }

    showEditModal(user) {
        this.setState({editedUser: user});
    }

    closeEditModal(user) {
        this.setState({editedUser: null});
    }

    handleSearch(e) {
        clearTimeout(this.timer);
        this.setState({search: e.target.value});
        this.timer = setTimeout(this.search.bind(this), 500);
    }

    search() {
        this.props.callbacks.searchUser(this.state.search);
    }

    render() {
        let cur = this.props.page;
        let all = Math.ceil(this.props.count/10);
        let editedUser = this.state.editedUser;
        if (this.props.new) editedUser = {
            id: 0,
            role: 'USER'
        };

        let modalCallbacks = {
            close: this.closeEditModal.bind(this),
            new: this.new.bind(this),
            edit: this.edit.bind(this),
            delete: this.delete.bind(this)
        };

        return(
            <div>
                <EditUser callbacks={modalCallbacks} user={editedUser} />
                <div className="table-responsive table-hover">
                    <table className="table table-striped table-sm">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nazwa użytkownika</th>
                            <th>Uprawnienia</th>
                            <th>Data utworzenia</th>
                            <th>Data edycji</th>
                            <th>#</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.list.map(user => {
                            return (
                                <tr key={"user"+user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.createdAt}</td>
                                    <td>{user.updatedAt}</td>
                                    <td>
                                        <div className="btn-group mr-2 btn-group-sm">
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.showEditModal(user)}>Edytuj</button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => this.delete(user)}>Usuń</button>
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

export default Users;