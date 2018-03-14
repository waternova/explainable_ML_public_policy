import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
    // import registerServiceWorker from './registerServiceWorker';
//ReactDOM.render(<App />, document.getElementById('root'));
    // registerServiceWorker();
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './home.js';
import Models from './models.js';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route path="/" component={App}>
                <Route exact path="/" component={Home}/>
                <Route path="home" component={Home}/>
                <Route path="models" component={Models}/>
            </Route>
        </div>
    </BrowserRouter>,
  document.getElementById('root')
);