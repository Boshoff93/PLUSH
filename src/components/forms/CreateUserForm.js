import React from 'react';
import { Button, Form, Label, Icon} from 'semantic-ui-react'
import uuid from 'uuid';
import Login from './Login'

class CreateUserForm extends React.Component{

  propTypes: {
    onClick: React.PropTypes.func.Required,
  }

  state = {
    firstname:'',
    lastname:'',
    email:'',
    password:'',
    confirm_password:'',
    isFirstName: false,
    isLastName: false,
    isEmail: false,
    isPassword: false,
    isPasswordMatch: false,
    emailTakenDisplay: false,
  }

  addUser(user){
    this.props.socket.emit('user add', user);
  }

  onChange = (e) => {
    switch (e.target.id) {
      case 'firstname': {
        this.setState({
          firstname: e.target.value,
          isFirstName: false,
        })
        break;
      }
      case 'lastname': {
        this.setState({
          lastname: e.target.value,
          isLastName: false,
        })
        break;
      }
      case 'email': {
        this.setState({
          email: e.target.value,
          isEmail: false,
          emailTakenDisplay: false,
        })
        break;
      }
      case 'password': {
        this.setState({
          password: e.target.value,
          isPassword: false,
          isPasswordMatch: false,
        })
        break;
      }
      case 'confirm password': {
        this.setState({
          confirm_password: e.target.value,
          isPassword: false,
          isPasswordMatch: false,
        })
        break;
      }
    }

  };

  handleSubmit = (e) => {
    let flag = false ;
    if(this.state.firstname === "") {
      this.setState({
        isFirstName: true
      })
      flag = true;
    }

    if (this.state.lastname === "") {
      this.setState({
        isLastName: true
      })
      flag = true;
    }

    if (!this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
      this.setState({
        isEmail: true
      })
      flag = true;
    }

    if (!this.state.password.match(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)){
      this.setState({
        isPassword: true
      })
      flag = true;
    }

    if (!this.state.confirm_password.match(this.state.password)){
      this.setState({
        isPasswordMatch: true
      })
      flag = true;
    }

    if(flag) {
      return
    }

    this.state.emailTakenDisplay = true

    let user = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email:  this.state.email,
      user_id: uuid.v4().toString(),
      password: this.state.password,
      created_at: uuid.v1().toString(),
    }
    this.addUser(user);

  };

  render() {
    return (
      <div className="ui center aligned container">
        <div className="ui grid centered">
          <div className="center aligned sixteen wide column">
          <h1 className='ui orange header'
            style={{ marginLeft:"8%", fontSize:"150px" , fontFamily:'Risque' }}
            >
            PLUSH
            <span><img height="150px" src={require("../../Images/Plush_Narwall.png")}/></span>
          </h1>
          </div>
          <div className="two wide column"></div>
          <div className="twelve wide column">
          <div className="row">
            <div className="ui center aligned container Plush-font Plush-blue">
              ENTER YOUR CREDENTIALS
            </div>
          </div>
          <div className="row" style={{marginTop:'50px'}}>
            <Form size={'big'} >
              <div className="ui grid centered">
                <div className="center aligned eight wide column">
                  <Form.Input
                    fluid placeholder='First Name'
                    onChange={this.onChange}
                    value={this.state.firstname}
                    id="firstname"
                    />
                    {this.state.isFirstName ? <Label basic color='red' pointing>First Name Required</Label> : null }
                </div>
                <div className="center aligned eight wide column">
                  <Form.Input
                    fluid placeholder='Last Name'
                    onChange={this.onChange}
                    value={this.state.lastname}
                    id="lastname"
                    />
                    {this.state.isLastName ? <Label basic color='red' pointing>Last Name Required</Label> : null }
                </div>
                <div className="center aligned sixteen wide column">
                  <Form.Input
                    fluid placeholder='Email'
                    onChange={this.onChange}
                    value={this.state.email}
                    id="email"
                    />
                    {this.state.isEmail ? <Label basic color='red' pointing>Invalid Email Address</Label> : null }
                    {this.props.emailTaken && this.state.emailTakenDisplay ? <Label basic color='red' pointing>A user is already registerd under this email address</Label> : null }
                </div>

                <div className="center aligned sixteen wide column">
                  <Form.Input
                    fluid placeholder='Password'
                    onChange={this.onChange}
                    value={this.state.password}
                    id="password"
                    type="password"
                    />
                    {this.state.isPassword ? <Label basic color='red' pointing>Password requires at least eight characters,
                     one uppercase character, one lowercase characters, one special character (!@#$%^&*), and one number</Label> : null }
                </div>
                <div className="center aligned sixteen wide column">
                  <Form.Input
                    fluid placeholder='Confirm Password'
                    onChange={this.onChange}
                    value={this.state.confirm_password}
                    id="confirm password"
                    type="password"
                    />
                    {this.state.isPasswordMatch ? <Label basic color='red' pointing>Password fields do not match</Label> : null }
                </div>
              </div>
            </Form>
            </div>
          </div>
          <div className="two wide column"></div>
        </div>
        <div className="row" style={{marginTop:'15px'}}>
          <div className="ui grid center aligned">
            <div className="two wide column"></div>
            <div className="six wide column">
              <Button className="fluid inverted orange"
                animated size={'massive'}
                onClick={this.props.onClick}
                >
                <Button.Content visible>Back to Login</Button.Content>
                <Button.Content hidden>
                  <Icon name='left arrow'
                    id='create_disable'
                   />
                </Button.Content>
              </Button>
            </div>
            <div className="six wide column">
            <Button className="fluid inverted orange" animated size={'massive'}>
              <Button.Content visible>Create Account</Button.Content>
              <Button.Content hidden>
              <Icon name='right arrow'
                onClick={this.handleSubmit}
              />
              </Button.Content>
            </Button>
            </div>
            <div className="two wide column"></div>
          </div>
        </div>
      </div>
    )
  }

}

export default CreateUserForm;
