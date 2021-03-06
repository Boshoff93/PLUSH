import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import {Provider} from 'react-redux'
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import AppBarHeader from './AppBarHeader'
import Profile from './Profile'
import Community from "./Community"
import Home from './Home'
import Login from './forms/Login'
import UserView from './UserView'
import createHistory from 'history/createBrowserHistory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {deepOrange500, orange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const history = createHistory()
console.log(history);

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#FF5522",
    accent1Color: "#FF5522",
    primary: {main: '#FF5522'}
  }
})

const App = ({store}) => (
  <Provider store = {store} >
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router>
        <Switch>
          <Route path="/my_community" render={(props) => (<div><AppBarHeader current_loc={"/my_community"}/> <Community/></div>)}/>
          <Route path="/view/:id" render={(props) => (<div><AppBarHeader current_loc={"/view/:id"}/> <UserView history={this.history}/></div>)}/>
          <Route path="/profile" component={() => (<div><AppBarHeader current_loc={"/profile"}/> <Profile/></div>)}/>
          <Route path="/home" component={() => (<div><AppBarHeader current_loc={"/home"}/> <Home/></div>)}/>
          <Route exact path='/' component={Login}/>
        </Switch>
      </Router>
    </MuiThemeProvider>
  </Provider>
);

export default App;
