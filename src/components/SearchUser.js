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
import { withRouter } from 'react-router'
import {replacePageTitle} from '../actions/replacePageTitle'

export class SearchUser extends React.Component {
  state = {
    value: '',
    redirect: false,
  };

  onChange = (e) => {
    let newState = this.state
    newState.value = e.target.value
    this.setState({
      newState
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
    console.log("Getting user: " + user_id);
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
      let newState = this.state
      newState.value = ''
      this.setState({
        newState
      });
    } else if(this.props.searchUsersIds[index] === (this.props.user_id)) {
      this.props.replacePageTitle("PROFILE")
      let newState = this.state
      newState.value = ''
      newState.redirect = true
      this.setState({
        newState
      });
      } else {
        this.props.setLoading()
        this.getUserView(this.props.searchUsersIds[index])
        let newState = this.state
        newState.value = ''
        newState.redirect = false
        this.setState({
          newState
        });

      }
console.log(this.state);
    }

  render() {
    console.log(this.state);
    if (this.state.redirect === true) {
      return <Redirect push to="/profile" />;
    } else {
      let searchedUsers = this.props.searchUsers
      if(searchedUsers !== null) {
        searchedUsers = this.props.searchUsers.map((user, index) => (
          <ListItem
            onClick={()=> this.handleSubmit(index)}
            key={uuid.v4()}
            style={{cursor:"pointer", borderRadius: "25px", fontSize:"14px", fontFamily:"Risque"}}
            primaryText={user}
            leftAvatar={<Avatar src={this.props.searchUsersAvatars[index] === "empty" ? require("../Images/DefaultAvatar.png") : this.props.searchUsersAvatars[index]} />}
          />
        ));
      }
      return (
        <div>
        <Paper style={{height: "100%", width: "90%", borderRadius: "25px", marginTop: "25px", marginLeft:"auto"}} zDepth={3}>
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <TextField
                  style={{width: "70%", fontFamily:"Risque"}}
                  hintText="Search Users"
                  hintStyle={{color:"#FF5522", fontFamily:"Risque"}}
                  onChange={this.onChange}
                  value={this.state.value}
                />
              </Row>
            </Col>
         </Row>
         </Paper>
         {searchedUsers.length !== 0 ?
         <Paper style={{height: "100%", width: "90%", borderRadius: "25px", margin: "10px 0px", marginLeft: "auto"}} zDepth={3}>
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
        :
        <div/>
        }
      </div>
    );
    }
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    replacePageTitle: replacePageTitle,
  }, dispatch)
}


export default withRouter(connect(null, matchDispachToProps)(SearchUser));
