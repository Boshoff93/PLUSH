import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import {Redirect} from 'react-router-dom'
import { Input, List } from 'semantic-ui-react'

export class SearchUser extends React.Component {
  state = {
    value: '',
    userPath: '',
    users: [],
  };


  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })

    if (this.state.value === '') {
      this.setState({
        users: [],
      });
      return
    }

    let search = e.target.value
    this.props.socket.emit('search users', {search});
  };

  getUserView(email) {
    this.props.socket.emit('user get', {email});
  }

  handleSubmit = (index) => {
    if(this.props.searchUsersEmails[index] === (this.props.email)) {
      this.setState({
        value: '',
        userPath: '/profile',
      });
      } else {
        this.getUserView(this.props.searchUsersEmails[index])
        this.setState({
          value: '',
          userPath: '',
        });
      }
    }

  render() {
    if (this.state.userPath === '/profile') {
      this.props.socket.close
      return <Redirect push to="/profile" />;
    } else {
      let searchedUsers = this.props.searchUsers
      if(searchedUsers !== null) {
        searchedUsers = this.props.searchUsers.map((user, index) => (
          <div className="ui segment center aligned"
            onClick={()=> this.handleSubmit(index)}
            >
            <List.Item
              key={uuid.v4()}
              style={{cursor:"pointer"}}
              >
              {user}
              </List.Item>
          </div>
        ));
      }
      return (
        <div>
        <Input
         className="Border-blue"
         style={{borderRadius: "5px"}}
         onChange={this.onChange}
         value={this.state.value}
         icon='users'
         iconPosition='left'
         placeholder='Search users...'
         />
        <List
          className="ui segment center aligned"
          style={{paddingBottom: "15px"}}
          >
          {searchedUsers}
        </List>
        </div>

        );
      }
  }
}


export default SearchUser
