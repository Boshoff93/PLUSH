import React from 'react';
import WrappedApp from './Profile';
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
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
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
        <a href='/profile'>

        <button
          onClick={this.handleSubmit}
          className='ui primary button large'
          type='submit'
          style={{fontFamily:'Risque', fontSize: '25px', backgroundColor: 'Orange', color: 'black' }}
        >
          Submit
        </button>
        </a>

      </div>
      </div>
      </div>
      </Router>
    )
  }
}

export default Login
