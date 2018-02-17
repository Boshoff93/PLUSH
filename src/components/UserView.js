import React from 'react';
import PostInput from './PostInput';
import ImageUpload from './ImageUpload'
import UserPostView from './UserPostView'
import SearchUser from './SearchUser';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {setUserView} from '../actions/setUserView';
import {replaceUserViewPosts} from '../actions/replaceUserViewPosts';
import {addUserViewPP} from '../actions/addUserViewPP';
import {connect} from 'react-redux';
import '../App.css';
import {Redirect,withRouter} from 'react-router-dom'
import { Image, Label } from 'semantic-ui-react'
import axios from 'axios';

class UserView extends React.Component {
  state = {
    userPath: '',
    preventHistoryPush: 0,
    searchUsers: [],
    searchUsersEmail: [],
  }

  componentDidMount() {
    this.getUser()
    this.setState({
      preventHistoryPush: 1
    })

    const unlisten = this.unlisten = this.props.history.listen((location, action) => {
      var newState = this.state;
      newState.preventHistoryPush = 1;
      this.setState({
        newState
      })
      this.getUser()
    });
  }

  getUser = () => {
    axios.get('http://localhost:8000/plush-api/userViewId/' + this.props.match.params.id).then(res => {
      if(res.data !== "User does not exist") {
        this.onGetUser(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  }

  componentWillUnmount() {
    const unlisten = this.unlisten
    unlisten()
  }

  onGetPosts(posts) {
    if(posts.Posts === null) {
      this.props.replaceUserViewPosts([], [])
    } else {
      this.props.replaceUserViewPosts(posts.Posts, posts.Post_Times)
    }
  }

  onError(error){
    //do nothing
  }

  onGetUser = (user) => {
   if(user.User_Id !== "") {
      this.props.setUserView(user.Firstname, user.Lastname, user.User_Id);
      var newState = this.state;
      newState.userViewId = user.User_Id;
      newState.searchUsers = [],
      newState.searchUsersEmail = [],
      newState.userPath = '/view'

      axios.get('http://localhost:8000/plush-api/getposts/' + user.User_Id).then(res => {
          let data = res.data
          this.onGetPosts(data)
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })

      axios.get('http://localhost:8000/plush-api/profilePicture/' + user.User_Id).then(res => {
          let data = res.data
          this.onGetProfilePicture(data)
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })

      if(newState.preventHistoryPush === 0) {
        this.props.history.push(`/view/${user.User_Id}`)
      }
      newState.preventHistoryPush = 0;
      UserView.setState({
        newState
      });
    }

  }

  onGetProfilePicture = (blob) => {
    if(blob !== "") {
      this.props.addUserViewPP(blob.Data);
    } else {
      this.props.addUserViewPP(require("../Images/DefaultAvatar.png"));
    }
  }

  onSearchUsers = (users) => {
      this.setState({
        searchUsers: users.Fullnames,
        searchUsersEmails: users.Emails
      });
  }

  render() {
    return (
      <div className="ui container">
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui segment center aligned Border-orange">
          <Label pointing='below' basic color='orange' size='big'>{this.props.userView.userViewFirstname} {this.props.userView.userViewLastname}</Label>
          <Image className = "Profile-border" src={this.props.userView.userViewProfilePicture}/>
          </div>
          <div>
            <SearchUser
              onSearchUsers={this.onSearchUsers}
              onGetUser={this.onGetUser}
              email={this.props.email}
              searchUsers={this.state.searchUsers}
              searchUsersEmails={this.state.searchUsersEmails}
            />
          </div>
        </div>
        <div className="twelve wide column">
          <div className="ui segment center aligned Border-orange">
            <div className='Plush-blue Plush-font Plush-margin'>
                PLUSH WALL POSTS
              </div>
              <div className='ui left aligned segment Border-orange Postview-format'>
                <UserPostView
                  posts={this.props.userView.userViewPosts}
                  post_times={this.props.userView.userViewPostTimes}
                  firstname={this.props.userView.firstname}
                  lastname={this.props.userView.lastname}
                />
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userView: state.userView,
    email: state.user.email,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    setUserView: setUserView,
    replaceUserViewPosts: replaceUserViewPosts,
    addUserViewPP: addUserViewPP,
  }, dispatch)
}



export default withRouter(connect(mapStateToProps, matchDispachToProps,)(UserView));
