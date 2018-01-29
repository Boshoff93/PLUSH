import React from 'react';
import WrappedApp from './Profile';
import uuid from 'uuid';
import Socket from './socket.js'
import {bindActionCreators} from 'redux'
import {setUser} from '../actions/setUser';
import {connect} from 'react-redux'

import {
  Link,
  Redirect,
  Switch,
} from 'react-router-dom'

let USERNAME = '';

class Login extends React.Component{
  state = {
    value: '',
    connected: false,
    id: '',
    userName: '',
    userSet: '',
  }

  componentDidMount(){
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('user add', this.onAddUser.bind(this));
    socket.on('username availible', this.onFindUserUnSuccessful.bind(this));
    socket.on('username unavailible', this.onAddUser.bind(this));
    socket.on('error', this.onError.bind(this));
  }

  onConnect(){
    this.setState({connected: true});
  }

  onDisconnect(){
    this.setState({connected: false});
  }

  onError(error){
    //do nothing
  }

  onAddUser(user) {
    var currentUser = this.state;
    currentUser.id = user.Id;
    currentUser.userName = user.Name;
    currentUser.value = '';
    currentUser.userSet = '/profile' ;
    this.setState({
      currentUser
    });
    this.props.setUser(this.state.userName)
  }

  onFindUserUnSuccessful(user) {
    this.addUser(user.Name);
  }

  findUser(name) {
    this.socket.emit('user find', {name});
  }

  addUser(name){
    var newUser = {
      id: uuid.v4().toString(),
      name: name,
    }
    this.socket.emit('user add', newUser);
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    if(this.state.value != ''){
      this.findUser(this.state.value);
    }
    this.setState({
      value:'',
    });
  };


  render(){
    if (this.state.userSet === '/profile') {
      return <Redirect push to="/profile" />;
    } else {
    return (
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
          className='ui inverted orange button'
          type='submit'
          style={{fontFamily:'Risque', fontSize: '25px'}}
        >
          Submit
        </button>
      </div>
      </div>

      </div>
    )
  }
}
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({setUser: setUser}, dispatch)
}

export default connect(null,matchDispachToProps)(Login);
