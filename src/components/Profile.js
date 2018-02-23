import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import SearchUser from './SearchUser';
import ImageUpload from './ImageUpload'
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {replacePosts} from '../actions/replacePosts';
import {setUserView} from '../actions/setUserView';
import {addProfilePicture} from "../actions/addProfilePicture";
import {deletePost} from '../actions/deletePost';
import { Image, Label } from 'semantic-ui-react'
import {connect} from 'react-redux';
import '../App.css';
import {Redirect} from 'react-router-dom'
import { withRouter } from 'react-router'
import axios from 'axios';

class Profile extends React.Component {
  state = {
    loggedIn: false,
    onProfile: true,
    userViewId: '',
    redirect: false,
    searchUsers: [],
    searchUsersIds: [],
  }

  componentWillMount() {
    if(this.props.access_token != "") {
      this.setState({
        loggedIn: true
      })
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000/plush-api/getposts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {
        let data = res.data
        this.onGetPosts(data)
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })

    axios.get('http://localhost:8000/plush-api/profilePicture/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {
        let data = res.data
        this.onGetProfilePicture(data)
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  }

  onGetPosts = (data) => {
    if(data.Posts === null) {
      this.props.replacePosts([],[],[])
    } else {
      this.props.replacePosts(data.Posts, data.Post_Times, data.Post_Ids)
    }
  }

  onGetProfilePicture = (data) => {
    if(data !== ""){
      this.props.addProfilePicture(data.Data);
    } else {
      this.props.addProfilePicture(require("../Images/DefaultAvatar.png"));
    }
  }

  onAddPost = (post) => {
    this.props.addPost(post.Post, post.Post_Time, post.Post_Id);
  }

  onDeletePost = (index) => {
    this.props.deletePost(index);
  }

  onGetUser = (user) => {
    if(user.User_Id === "") {
      console.log("user does not exist");
    } else {
      this.props.setUserView(user.Display_Name, user.User_Id);
      this.setState({
        searchUsers: [],
        searchUsersEmails: [],
        redirect: true,
        userViewId: user.User_Id
      });
    }
  }

  onAddProfilePicture = (blob) => {
    this.props.addProfilePicture(blob.Data);
  }

  onSearchUsers = (users) => {
      this.setState({
        searchUsers: users.Display_Names,
        searchUsersIds: users.User_Ids
      });
  }

  render() {
    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }
    if (this.state.redirect === true) {
      return <Redirect push to={`/view/${this.state.userViewId}`}/>;
    }
    return (
      <div className="ui container">
        <div className="ui grid">
          <div className="four wide column">
            <div className="ui segment center aligned Border-orange">
              <Label pointing='below' basic color='orange' size='big'>{this.props.display_name}</Label>
              <Image src={this.props.profile_picture} className = "Profile-border"/>
              <ImageUpload
                user_id={this.props.user_id}
                onAddProfilePicture={this.onAddProfilePicture}
                access_token={this.props.access_token}
              />
            </div>
            <div>
              <SearchUser
                onProfile={this.state.onProfile}
                user_id={this.props.user_id}
                onSearchUsers={this.onSearchUsers}
                onGetUser={this.onGetUser}
                searchUsers={this.state.searchUsers}
                searchUsersIds={this.state.searchUsersIds}
                access_token={this.props.access_token}
              />
            </div>
          </div>
          <div className="twelve wide column">
            <div className="ui segment center aligned Border-orange">
              <div className='Plush-blue Plush-font Plush-margin'>
                  PLUSH WALL POSTS
                </div>
                <div className='ui right aligned segment Border-blue'>
                <PostInput
                  socket={this.socket}
                  user_id={this.props.user_id}
                  onAddPost={this.onAddPost}
                  access_token={this.props.access_token}
                />
                <div className='ui left aligned segment Border-orange Postview-format'>
                  <PostView
                    socket={this.socket}
                    posts={this.props.posts}
                    post_ids={this.props.post_ids}
                    post_times={this.props.post_times}
                    display_name={this.props.display_name}
                    user_id={this.props.user_id}
                    onDeletePost={this.onDeletePost}
                  />
                  </div>
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
    access_token: state.user.access_token,
    display_name: state.user.display_name,
    posts: state.user.posts,
    post_times: state.user.post_times,
    post_ids: state.user.post_ids,
    user_id: state.user.user_id,
    profile_picture: state.user.profile_picture,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    addProfilePicture: addProfilePicture,
    replacePosts: replacePosts,
    setUserView: setUserView,
    deletePost: deletePost,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Profile));
