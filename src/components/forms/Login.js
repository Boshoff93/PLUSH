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
import {fire, googleProvider, facebookProvider} from './Config'

class Login extends React.Component{
  state = {
    redirect: false,
    unsuccessful: false,
  }

  componentDidMount(){

  }

  onAddUser = (user) => {
    this.props.setUser(user.Display_Name, user.Email, user.User_Id)
    this.setState({
      redirect: true,
      unsuccessful: false,
    });
  }

  onUnSuccessful = () => {
    this.setState({
      unsuccessful : true
    });
    console.log("Permission Dinied");
  }

  responseGoogle = (response) => {
    console.log(response);
    let user_info = {
      display_name: response.user.displayName,
      user_id: response.user.uid,
      created_at: uuid.v1().toString(),
    }
    axios.post('http://localhost:8000/plush-api/login', JSON.stringify(user_info), {headers: {'Authorization': response.credential.idToken} }).then(res => {
      if(res.data === "access denied") {
        this.onUnSuccessful()
      } else {
        this.onAddUser(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
   })
  }

  signOut = () => {
    console.log("user logged out");
    fire.auth().signOut().then((user) => {
      console.log(user);
    })
  }

  authWithGoogle = () => {
    console.log("authed with google");
    fire.auth().signInWithPopup(googleProvider).then((result,error) => {
      if(error) {
        console.log("error could not connect");
      } else {
        this.responseGoogle(result)
      }
    })
  }

  render(){
    if (this.state.redirect === true) {
      return <Redirect push to="/profile" />;
    } else {
      return (
        <div>
          <button style={{width: "100%"}}
            className="semantic ui button primary"
            onClick={() => {this.authWithGoogle()}}> Login with Google
          </button>
          <button style={{width: "100%"}}
            className="semantic ui button primary"
            onClick={() => {this.signOut()}}> Logout with Google
          </button>
          </div>
      )
    }
  }
}


function matchDispachToProps(dispatch) {
  return bindActionCreators({setUser: setUser}, dispatch)
}

export default connect(null,matchDispachToProps)(Login);
