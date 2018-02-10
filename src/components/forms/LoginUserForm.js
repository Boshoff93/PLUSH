import React from 'react';
import { Button, Form, Label, Icon} from 'semantic-ui-react'

class LoginUserForm extends React.Component{

  propTypes: {
    onClick: React.PropTypes.func.Required,
  }

  state = {
    email:'',
    password:'',
  }

  findUser(user) {
    this.props.socket.emit('user find', user);
  }

  onChange = (e) => {
    if(e.target.id === 'password') {
      this.setState({
        password: e.target.value,
      })
    } else {
      this.setState({
        email: e.target.value,
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
        email:'',
        password:'',
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
                <Form.Group widths='equal'>
                  <Form.Input
                    fluid placeholder='Email Adress'
                    onChange={this.onChange}
                    value={this.state.email}
                    id="email"
                    />
                  <Form.Input
                    fluid placeholder='Password'
                    onChange={this.onChange}
                    value={this.state.password}
                    id="password"
                    />
                </Form.Group>
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
