import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import SearchUser from './SearchUser';
import ImageUpload from './ImageUpload'
import Socket from './socket.js';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {replacePosts} from '../actions/replacePosts';
import {setUserView} from '../actions/setUserView';
import {addProfilePicture} from "../actions/addProfilePicture";
import { Image, Label } from 'semantic-ui-react'
import {connect} from 'react-redux';
import '../App.css';
import {Redirect} from 'react-router-dom'
import { withRouter } from 'react-router'

class Profile extends React.Component {

  state = {
    connected: false,
    userViewId: '',
    userPath: '',
  }


  componentDidMount() {
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('user get', this.onGetUser.bind(this));
    socket.on('post add', this.onAddPost.bind(this));
    socket.on('posts get', this.onGetPosts.bind(this));
    socket.on('profile picture add', this.onAddProfilePicture.bind(this))
    socket.on('profile picture get', this.onGetProfilePicture.bind(this))
    socket.on('error', this.onError.bind(this));
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
  }

  onConnect(){
    let user = {
      user_id: this.props.user_id
    }
    this.socket.emit('posts get', user);
    this.socket.emit('profile picture get', user )
    var newState = this.state;
    newState.connected = true;
    this.setState({
      newState
    })
  }

  onDisconnect(){
    var newState = this.state;
    newState.connected = false;
    this.setState({
      newState
    })
  }

  onGetPosts(posts) {
    if(posts.Posts === null) {
      this.props.replacePosts([],[],[])
    } else {
      this.props.replacePosts(posts.Posts, posts.Post_Times, posts.Post_Ids)
    }
  }

  onAddPost(post) {
    this.props.addPost(post.Post, post.Post_Time, post.Post_Id);
  }

  onGetUser(user){
    if(user.User_Id === null) {
      alert("User Does Not Exist");
    } else {
      this.props.setUserView(user.Firstname, user.Lastname, user.User_Id);
      var newState = this.state;
      newState.userPath = '/view';
      newState.userViewId = user.User_Id
      this.setState({
        newState
      });
    }
  }

  onAddProfilePicture(blob) {
    this.props.addProfilePicture(blob.Data);
  }

  onGetProfilePicture(blob) {
    if(blob !== ""){
      this.props.addProfilePicture(blob.Data);
    } else {
      this.props.addProfilePicture(require("../Images/DefaultAvatar.png"));
    }
  }

  onError(error){
    //do nothing
  }

  render() {
    if (this.state.userPath === '/view') {
      this.socket.close
      return <Redirect push to={`/view/${this.state.userViewId}`}/>;
    }

    return (
      <div className="ui container">
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui segment center aligned Border-orange">

            <Label pointing='below' basic color='orange' size='big'>{this.props.firstname} {this.props.lastname}</Label>
            <Image src={this.props.profile_picture} className = "Profile-border"/>
            <ImageUpload
              socket={this.socket}
              user_id={this.props.user_id}
            />
          </div>
          <div>
            <SearchUser
              socket={this.socket}
              email={this.props.email}
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
              />
              <div className='ui left aligned segment Border-orange Postview-format'>
                <PostView
                  socket={this.socket}
                  posts={this.props.posts}
                  post_ids={this.props.post_ids}
                  post_times={this.props.post_times}
                  firstname={this.props.firstname}
                  lastname={this.props.lastname}
                  user_id={this.props.user_id}
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
    firstname: state.firstname,
    lastname: state.lastname,
    email: state.email,
    posts: state.posts,
    post_times: state.post_times,
    post_ids: state.post_ids,
    user_id: state.user_id,
    profile_picture: state.profile_picture,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    addProfilePicture: addProfilePicture,
    replacePosts: replacePosts,
    setUserView: setUserView,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Profile));
