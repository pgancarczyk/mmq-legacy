import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Client from './Client';
import Dashboard from './Dashboard';


class App extends Component {
    render() {
        return(
            <Router>
                <Route exact path="/" component={Client}/>
                <Route path="/dashboard" component={Dashboard}/>
            </Router>
        )
    }
}

export default App;