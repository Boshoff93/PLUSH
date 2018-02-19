import React from 'react';
import {bindActionCreators} from 'redux'
import {setUser} from '../../actions/setUser';
import {connect} from 'react-redux'
import "../../App.css"
import {Form, Label, Icon} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'
import CreateUserForm from './CreateUserForm'
import LoginUserForm from './LoginUserForm'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios'
import uuid from 'uuid';



class Login extends React.Component{
  state = {
    userPath: '',
    disable_create: true,
    emailTaken: false,
    unsuccessful: false,
  }

  componentDidMount(){

  }

  onAddUser = (user) => {
    this.props.setUser(user.Firstname, user.Lastname, user.Email, user.User_Id)
    var currentUser = this.state;
    currentUser.userPath = '/profile' ;
    currentUser.emailTaken = false;
    currentUser.unsuccessful = false;
    this.setState({
      currentUser
    });
  }

  onUnSuccessful = () => {
    {/*var currentUser = this.state;
    currentUser.unsuccessful = true ;
    this.setState({
      currentUser
    });*/}
    console.log("Permission Dinied");
  }

  onEmailUnavailible = () => {
    var currentUser = this.state;
    currentUser.emailTaken = true ;
    this.setState({
      currentUser
    });
  }

  renderCreateUser = (e) => {
      this.setState({
        disable_create: !this.state.disable_create,
      });
  }

  responseGoogle = (response) => {
    console.log(response);
    let user_info = {
      firstname:response.w3.ofa,
      lastname:response.w3.wea,
      user_id: uuid.v4().toString(),
      created_at: uuid.v1().toString(),
    }
    axios.post('http://localhost:8000/plush-api/login', JSON.stringify(user_info), {headers: {'Authorization': response.tokenId} }).then(res => {
      if(res.data === "access denied") {
        this.onUnSuccessful()
      } else {
        this.onAddUser(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
   })
  }
  logout = (response) => {
    console.log("user logged out");
  }

  render(){
    if (this.state.userPath === '/profile') {
      return <Redirect push to="/profile" />;
    } else {

      if(this.state.disable_create === true) {
        return (
          <div>
          <GoogleLogin
            clientId="729356241272-g4gtvdrpvhsts6ogat3n8kv0ma1vidhm.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            />
            <GoogleLogout
              buttonText="Logout"
              onLogoutSuccess={this.logout}
            >
            </GoogleLogout>
            </div>
        )
      } else {
        return (
          <CreateUserForm
            onClick={this.renderCreateUser}
            emailTaken={this.state.emailTaken}
            onEmailUnavailible={this.onEmailUnavailible}
            onAddUser={this.onAddUser}
          />
        )
      }
  }
}
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({setUser: setUser}, dispatch)
}

export default connect(null,matchDispachToProps)(Login);
