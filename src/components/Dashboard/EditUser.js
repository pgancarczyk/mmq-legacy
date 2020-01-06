import React, {Component} from 'react';

class EditUser extends Component {
    edit(e) {
        e.preventDefault();
        this.props.callbacks.edit(e.target);
    }
    
    delete() {
        this.props.callbacks.delete(this.props.user);
        window.$('#editUserModal').modal('hide');
    }

    new(e) {
        e.preventDefault();
        this.props.callbacks.new(e.target);
        window.$('#editUserModal').modal('hide');
    }

    close() {
        this.props.callbacks.close();
        window.$('#editUserModal').modal('hide');
    }

    render() {
        let user = this.props.user;
        if(!user) return(<div></div>);

        return(
            <div className="modal fade" id="editUserModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <form onSubmit={user.id ? this.edit.bind(this) : this.new.bind(this)}>
                                <div className="form-group">
                                    <label>Imię:</label>
                                    <input className="form-control" type="text" name="name" defaultValue={user.name} required/>
                                </div>
                                <div className="form-group">
                                    <label>Hasło:</label>
                                    <input className="form-control" type="password" name="password" placeholder={user.id ? "pozostaw pole puste, aby nie zmieniać hasła" : ""} required={user.id === 0}/>
                                </div>
                                <div className="form-group">
                                    <label>Uprawnienia:</label>
                                    <select className="form-control" name="role" defaultValue={user.role}>
                                        <option value="USER">użytkownik</option>
                                        <option value="MOD">moderator</option>
                                        <option value="ADMIN">administrator</option>
                                    </select>
                                </div>
                                <button className="btn btn-success btn-block" type="submit">Zapisz</button>
                                {user.id !== 0 && <button className="btn btn-danger btn-block" onClick={this.delete.bind(this)} type="button">Usuń</button>}
                                <button className="btn btn-info btn-block" type="button" onClick={this.close.bind(this)}>Zamknij</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate() {
        window.$('#editUserModal').modal();
    }
}

export default EditUser;