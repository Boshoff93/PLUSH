import React from 'react';
import {bindActionCreators} from 'redux'
import {setUser} from '../../actions/setUser';
import {connect} from 'react-redux'
import "../../App.css"
import {Form, Label, Icon} from 'semantic-ui-react'
import {Redirect} from 'react-router-dom'
import CreateUserForm from './CreateUserForm'
import LoginUserForm from './LoginUserForm'

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
    var currentUser = this.state;
    currentUser.unsuccessful = true ;
    this.setState({
      currentUser
    });
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


  render(){
    if (this.state.userPath === '/profile') {
      return <Redirect push to="/profile" />;
    } else {

      if(this.state.disable_create === true) {
        return (
          <LoginUserForm
            onClick={this.renderCreateUser}
            onAddUser={this.onAddUser}
            onUnSuccessful={this.onUnSuccessful}
          />
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
