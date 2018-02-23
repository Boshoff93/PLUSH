import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import {Provider} from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import Profile from './Profile';
import Login from './forms/Login';
import UserView from './UserView'
import createHistory from 'history/createBrowserHistory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {deepOrange500, orange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const history = createHistory()
console.log(history);

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#FF5722",
    accent1Color: "#FF5722"
  }
})

const App = ({store}) => (
  <div className='ui grid'>
  <MuiThemeProvider muiTheme={muiTheme}>
    <HeaderBar />
    <Provider store = {store} >
      <Router>
        <Switch>
          <Route path="/view/:id" render={(props) => (<UserView history={this.history}/>)}/>
          <Route path="/profile" component={Profile}/>
          <Route exact path='/' component={Login}/>
        </Switch>
      </Router>
    </Provider>
    </MuiThemeProvider>
  </div>
);

export default App;
