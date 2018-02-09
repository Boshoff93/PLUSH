import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import {Redirect} from 'react-router-dom'
import { Input } from 'semantic-ui-react'

export class SearchUser extends React.Component {
  state = {
    value: '',
    userPath: '',
  };


  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  getUserView(name) {
    this.props.socket.emit('user get', {name});
  }

  handleSubmit = (target) => {
    if(target.charCode==13){
      if(this.state.value != '') {
        if(this.state.value === this.props.userName) {
          this.setState({
            value: '',
            userPath: '/profile',
          });
        } else {
        this.getUserView(this.state.value)
        this.setState({
          value: '',
          userPath: '',
        });
        }
      }
    }
  };

  render() {
    if (this.state.userPath === '/profile') {
      this.props.socket.close
      return <Redirect push to="/profile" />;
    } else {
      return (
        <Input
         className="Border-blue"
         style={{borderRadius: "5px"}}
         onChange={this.onChange}
         onKeyPress={this.handleSubmit}
         value={this.state.value}
         icon='users'
         iconPosition='left'
         placeholder='Search users...'
         />

        );
      }
  }
}


export default SearchUser
