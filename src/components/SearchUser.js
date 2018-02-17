import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import {Redirect} from 'react-router-dom'
import { Input, List } from 'semantic-ui-react'
import axios from 'axios';

export class SearchUser extends React.Component {
  state = {
    value: '',
    userPath: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
    if (e.target.value === '') {
      let emptyList = {
        Fullnames:  [],
        Emails: []
      }
      this.props.onSearchUsers(emptyList)
      return
    }

    axios.get('http://localhost:8000/plush-api/searchUsers/' + e.target.value).then(res => {
      this.props.onSearchUsers(res.data)
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  };

  getUserView(email) {
    axios.get('http://localhost:8000/plush-api/userViewEmail/' + email).then(res => {
      this.props.onGetUser(res.data)
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
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
      return <Redirect push to="/profile" />;
    } else {
      let searchedUsers = this.props.searchUsers
      if(searchedUsers !== null) {
        searchedUsers = this.props.searchUsers.map((user, index) => (
          <div className="ui segment center aligned"
            onClick={()=> this.handleSubmit(index)}
            key={uuid.v4()}
            >
            <List.Item
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
