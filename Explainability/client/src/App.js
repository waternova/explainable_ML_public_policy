import React, { Component } from 'react';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import ModelList from './ModelList.js';
import DataSetList from './DataSetList.js';
import Home from './home.js';
import ModelView from './ModelView.js';
import Header from './header.js';
import Footer from './footer.js';
import Links from './Links.js';

class App extends Component {
  render()
  {
    return (
      <Router>
        <div>
          <Header />
          <Route exact path="/" component={Home}/>
          <Route path="/DataSetList" component={DataSetList}/>
          <Route path="/ModelList" component={ModelList}/>
          <Route path="/Links" component={Links}/>
          <Route path="/ModelView/:id" component={ModelView}/>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
