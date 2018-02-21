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
    redirect: false,
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
    if (e.target.value === '') {
      this.clearList()
      return
    }

    axios.get('http://localhost:8000/plush-api/searchUsers/' + e.target.value, {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        this.props.onSearchUsers(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  };

  getUserView(user_id) {
    axios.get('http://localhost:8000/plush-api/userViewId/' + user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        this.props.onGetUser(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  }

  clearList() {
    let emptyList = {
      Display_Names:  [],
      User_Ids: []
    }
    this.props.onSearchUsers(emptyList)
  }

  handleSubmit = (index) => {
    if(this.props.searchUsersIds[index] === (this.props.user_id) && this.props.onProfile) {
      this.clearList()
      this.setState({
        value: '',
      });
    } else if(this.props.searchUsersIds[index] === (this.props.user_id)) {
      this.setState({
        value: '',
        redirect: true,
      });
      } else {
        this.getUserView(this.props.searchUsersIds[index])
        this.setState({
          value: '',
          redirect: false,
        });
      }
    }

  render() {
    if (this.state.redirect === true) {
      console.log("then got here");
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
