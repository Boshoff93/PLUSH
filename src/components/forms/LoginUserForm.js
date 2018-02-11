import React from 'react';
import { Button, Form, Label, Icon} from 'semantic-ui-react'

class LoginUserForm extends React.Component{

  propTypes: {
    onClick: React.PropTypes.func.Required,
  }

  state = {
    email:'',
    password:'',
    isCorrect: false,
  }

  findUser(user) {
    this.props.socket.emit('user find', user);
  }

  onChange = (e) => {
    if(e.target.id === 'password') {
      this.setState({
        password: e.target.value,
        isCorrect: false,
      })
    } else {
      this.setState({
        email: e.target.value,
        isCorrect: false,
      })
    }
  };

  handleSubmit = (e) => {
      if(this.state.email !== '' && this.state.password !== ''){
        let user = {
          email:    this.state.email,
          password: this.state.password
        }
        this.findUser(user);
      }
      this.setState({
        isCorrect: true
      })
  };

  render() {
    return (
      <div className="ui center aligned container">
        <div className="ui grid centered">
          <div className="four wide column"></div>
          <div className="eight wide column">
            <div className="row" style={{marginTop:'100px'}}>
              <Button className="fluid"
                inverted color='orange'
                size="massive"
                onClick={this.props.onClick}
                id="create_enable"
                >
                Create Account
              </Button>
            </div>
            <div className="row" style={{marginTop:'50px'}}>
              <Button className="fluid"
                 inverted color='orange'
                 size="massive"
                 onClick={this.handleSubmit}
                 id="login"
                 >
                 Log In
               </Button>
            </div>
            <div className="row" style={{marginTop:'20px'}}>
              <div className="ui grid center aligned">
                <div className="eight wide column">
                 <Label size={'big'} basic color='orange' pointing="below">Email Address</Label>
                </div>
                <div className="eight wide column">
                 <Label size={'big'} basic color='orange' pointing="below">Password</Label>
                </div>
              </div>
            </div>
            <div className="row">
              <Form size={'big'} >
                <div className="ui grid centered">
                  <div className="center aligned eight wide column">
                    <Form.Input
                      fluid placeholder='Email Adress'
                      onChange={this.onChange}
                      value={this.state.email}
                      id="email"
                      />
                  </div>
                  <div className="center aligned eight wide column">
                    <Form.Input
                      fluid placeholder='Password'
                      onChange={this.onChange}
                      value={this.state.password}
                      id="password"
                      />
                  </div>
                  <div className="center aligned sixteen wide column">
                    {this.state.isCorrect && this.props.unsuccessful ? <Label basic color='red' pointing>Invalid Email or Password</Label> : null }
                  </div>
                </div>
              </Form>
            </div>
          </div>
          <div className="four wide column"></div>
        </div>
      </div>
    )
  }

}

export default LoginUserForm;
