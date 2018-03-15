import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import ModelList from './ModelList.js';
import Home from './home.js';
import ModelView from './ModelView.js';
import Header from './header.js';

class App extends Component {
    constructor (props)
    {
		super(props)
	}
    render()
    {
        return (
            <div>
                <Header />
                <Route exact path="/" component={Home}/>
                <Route path="/ModelList" component={ModelList}/>
                <Route path="/ModelView" component={ModelView}/>
            </div>
        );
    }
}

export default App;
