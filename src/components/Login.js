import React from 'react';
import WrappedApp from './Profile';
import uuid from 'uuid';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom'

class Login extends React.Component{
  state = {
    value: '',
    connected: false,
    userName: '',
    id: '',
  }

  componentDidMount(){
    let ws = this.ws = new WebSocket('ws://echo.websocket.org')
    ws.onmessage = this.message.bind(this);
    ws.onopen = this.open.bind(this);
    ws.onclose = this.close.bind(this);
  }

  message(e) {
    const event = JSON.parse(e.data);
    if(event.name === 'user add') {
      this.newUser(event.data);
    }
  }

  open() {
    this.setState({
      connected: true
    });
  }
  close() {
    this.setState({
      connected: false
    });
  }

  newUser(user) {
    let currentUser = this.state;
    currentUser.id = user.id;
    currentUser.userName = user.name;
    this.setState({
      currentUser
    });

  }

  addUser(name){
    let msg = {
      name: 'user add',
      data: {
        id: uuid.v4(),
        name: name,
      }
    }
    this.ws.send(JSON.stringify(msg))
  }

  setUser(activeUser) {
    //TODO: get user messages this will go into profile
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    this.addUser(this.state.value);
    this.setState({
      value: '',
    });
  };

  render(){
    return (
      <Router>
      <div className="ui center aligned container"
        style={{fontFamily:'Risque', fontSize: '35px', color:'Orange', marginTop: '150px' }}
      >
      ENTER YOUR PLUSH USERNAME!

      <div className="ui center aligned container"
        style={{fontFamily:'Risque', fontSize: '25px', marginTop: '20px' }}
      >
      <div className='ui input center'>
        <input
          onChange={this.onChange}
          value={this.state.value}
        type='text'
        />


        <button
          onClick={this.handleSubmit}
          className='ui primary button large'
          type='submit'
          style={{fontFamily:'Risque', fontSize: '25px', backgroundColor: 'Orange', color: 'black' }}
        >
          Submit
        </button>


      </div>

      <div>
        <input
          onChange={this.onChange}
          value={this.state.userName + " " + this.state.id}
        type='text'
        />
      </div>

      </div>

      </div>
      </Router>
    )
  }
}

export default Login
