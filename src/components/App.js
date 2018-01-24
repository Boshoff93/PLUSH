import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import Profile from './Profile';
import Login from './Login';

const App = () => (
  <div className='ui grid'>
    <HeaderBar />
    <div className='spacer row' />
    <div className='row'>
    <Switch>
    <Route path="/profile" component={Profile}/>
    <Route exact path='/' component={Login} render={() => (
          <Redirect
            to='/'
          />
        )} />
    </Switch>
    </div>

  </div>
);

export default App;
