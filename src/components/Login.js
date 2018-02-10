import React from 'react';
import uuid from 'uuid';
import Socket from './socket.js'
import {bindActionCreators} from 'redux'
import {setUser} from '../actions/setUser';
import {connect} from 'react-redux'
import "../App.css"
import { Button, Form, Label, Icon} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'
import CreateUserForm from './forms/CreateUserForm'
import LoginUserForm from './forms/LoginUserForm'

class Login extends React.Component{
  state = {
    value: '',
    connected: false,
    user_id: '',
    userName: '',
    userPath: '',
    disable_create: true,
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
    let newState = this.state;
    newState.connectted = true;
    this.setState(newState);
  }

  onDisconnect(){
    let newState = this.state;
    newState.connectted = false;
    this.setState(newState);
  }

  onError(error){
    //do nothing
  }

  onAddUser(user) {
    var currentUser = this.state;
    currentUser.user_id = user.User_Id;
    currentUser.userName = user.Name;
    currentUser.userPath = '/profile' ;
    this.setState({
      currentUser
    });
    this.props.setUser(user.Name, user.User_Id)
  }

  onFindUserUnSuccessful(user) {
    this.addUser(user.Name);
  }

  renderCreateUser = (e) => {
    if(e.target.id === 'create_enable' || e.target.id === 'create_disable'){
      this.setState({
        disable_create: !this.state.disable_create,
      });
    }
  }

  render(){
    if (this.state.userPath === '/profile') {
      this.socket.close
      return <Redirect push to="/profile" />;
    } else {

      if(this.state.disable_create === true) {
        return (
          <LoginUserForm
            onClick={this.renderCreateUser}
            socket={this.socket}
          />
        )
      } else {
        return (
          <CreateUserForm
            onClick={this.renderCreateUser}
            socket={this.socket}
          />
        )
      }

  }
}
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({setUser: setUser}, dispatch)
}

function mapStateToProps(state) {
  return {
    userName: state.userName,
    posts: state.posts
  }
}

export default connect(mapStateToProps,matchDispachToProps)(Login);
