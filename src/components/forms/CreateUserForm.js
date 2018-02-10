import React from 'react';
import { Button, Form, Label, Icon} from 'semantic-ui-react'

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
  }

  addUser(user){
    this.props.socket.emit('user add', user);
  }

  onChange = (e) => {
    switch (e.target.id) {
      case 'firstname': {
        this.setState({
          firstname: e.target.value,
        })
        break;
      }
      case 'lastname': {
        this.setState({
          lastname: e.target.value,
        })
        break;
      }
      case 'email': {
        this.setState({
          email: e.target.value,
        })
        break;
      }
      case 'password': {
        this.setState({
          password: e.target.value,
        })
        break;
      }
      case 'confirm password': {
        this.setState({
          confirm_password: e.target.value,
        })
        break;
      }
    }

  };

  handleSubmit = (e) => {
    let user = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email:  this.state.email,
      password: this.state.password,
    }
    this.addUser(user);
  };

  render() {
    return (
      <div className="ui center aligned container">
        <div className="ui grid centered">
          <div className="two wide column"></div>
          <div className="twelve wide column">
          <div className="row">
            <div className="ui center aligned container Plush-font Plush-blue">
              ENTER YOUR CREDENTIALS
            </div>
          </div>
          <div className="row" style={{marginTop:'50px'}}>
            <Form size={'big'} >
              <Form.Group widths='equal'>
                <Form.Input
                  fluid placeholder='First Name'
                  onChange={this.onChange}
                  value={this.state.firstname}
                  id="firstname"
                  />
                <Form.Input
                  fluid placeholder='Last Name'
                  onChange={this.onChange}
                  value={this.state.lastname}
                  id="lastname"
                  />
              </Form.Group>
              <Form.Group  widths='equal'>
                <Form.Input
                  fluid placeholder='Email'
                  onChange={this.onChange}
                  value={this.state.email}
                  id="email"
                  />
              </Form.Group>
              <Form.Group  widths='equal'>
                <Form.Input
                  fluid placeholder='Password'
                  onChange={this.onChange}
                  value={this.state.password}
                  id="password"
                  />
              </Form.Group>
              <Form.Group  widths='equal'>
                <Form.Input
                  fluid placeholder='Confirm Password'
                  onChange={this.onChange}
                  value={this.state.confirm_password}
                  id="confirm password"
                  />
              </Form.Group>
            </Form>
            </div>
          </div>
          <div className="two wide column"></div>
        </div>
        <div className="row">
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
