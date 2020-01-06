import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import './scripts/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './scripts/serviceWorker';
//'../node_modules/jquery/dist/jquery.min.js';
window.$ = window.jQuery = require('jquery')

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();