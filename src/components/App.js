import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import {Provider} from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import Profile from './Profile';
import Login from './Login';
import UserView from './UserView'

const App = ({store}) => (
  <div className='ui grid'>
    <HeaderBar />
    <div className='spacer row' />
    <div className='row'>
    <Provider store = {store} >
      <Router>
        <Switch>
          <Route path="/view/:name" component={UserView}/>
          <Route path="/profile" component={Profile}/>
          <Route exact path='/' component={Login}/>
        </Switch>
      </Router>
    </Provider>
    </div>

  </div>
);

export default App;
