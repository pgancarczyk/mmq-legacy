import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './scripts/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Client from './components/Client';
import * as serviceWorker from './scripts/serviceWorker';

ReactDOM.render(<Client />, document.getElementById('root'));

serviceWorker.unregister();