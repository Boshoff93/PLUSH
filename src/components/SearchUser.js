import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import {Redirect} from 'react-router-dom'
import axios from 'axios';
import {Row, Col } from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

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
    axios.get('http://localhost:8000/plush-api/searchUsers/' + e.target.value, {headers: {'Authorization': this.props.access_token}}).then(res1 => {
      if('Error' in res1.data) {
        console.log(res1.data.Error);
      } else {
        axios.get('http://localhost:8001/plush-file-server/searchedUserProfilePictures/' + res1.data.Pp_Names, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
          if(res2.data != null) {
            if('Error' in res2.data) {
              console.log(res2.data.Error);
            } else {
              console.log(res2.data.Data);
              var usersFound = {
                Display_Names: res1.data.Display_Names,
                User_Ids: res1.data.User_Ids,
                Avatars: res2.data.Data,
              }
              this.props.onSearchUsers(usersFound)
            }
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }).catch(err => {
      console.log(err);
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
      return <Redirect push to="/profile" />;
    } else {
      let searchedUsers = this.props.searchUsers
      if(searchedUsers !== null) {
        searchedUsers = this.props.searchUsers.map((user, index) => (
          <ListItem
            onClick={()=> this.handleSubmit(index)}
            key={uuid.v4()}
            style={{cursor:"pointer", borderRadius: "25px", fontSize:"12px"}}
            primaryText={user}
            leftAvatar={<Avatar src={this.props.searchUsersAvatars[index] === "empty" ? require("../Images/DefaultAvatar.png") : this.props.searchUsersAvatars[index]} />}
          />
        ));
      }
      return (
        <div>
        <Paper style={{height: "100%", width: "90%", borderRadius: "25px", marginTop: "25px"}} zDepth={3}>
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <TextField
                  style={{width: "70%"}}
                  hintText="Search Users"
                  hintStyle={{color:"#FF5522", fontFamily:"Risque"}}
                  onChange={this.onChange}
                  value={this.state.value}
                />
              </Row>
            </Col>
         </Row>
         </Paper>
         <Paper style={{height: "100%", width: "90%", borderRadius: "25px", margin: "10px 0px"}} zDepth={3}>
         <Row>
            <Col xs={12}>
              <Row center="xs">
                <List>
                  {searchedUsers}
                </List>
              </Row>
            </Col>
        </Row>
      </Paper>
      </div>
    );
    }
  }
}


export default SearchUser
