import React from 'react';
import PostInput from './PostInput';
import ImageUpload from './ImageUpload'
import UserPostView from './UserPostView'
import SearchUser from './SearchUser';
import Socket from './socket.js';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {setUserView} from '../actions/setUserView';
import {replaceUserViewPosts} from '../actions/replaceUserViewPosts';
import {addUserViewPP} from '../actions/addUserViewPP';
import {connect} from 'react-redux';
import '../App.css';
import {Redirect,withRouter} from 'react-router-dom'
import { Image, Label } from 'semantic-ui-react'

class UserView extends React.Component {
  state = {
    conected: false,
    userPath: '',
    preventHistoryPush: 0,
  }

  componentDidMount() {
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('posts get', this.onGetPosts.bind(this));
    socket.on('user get', this.onGetUser.bind(this));
    socket.on('error', this.onError.bind(this));
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
    socket.on('profile picture get', this.onGetProfilePicture.bind(this));

    const unlisten = this.unlisten = this.props.history.listen((location, action) => {
      var newState = this.state;
      newState.preventHistoryPush = 1;
      this.setState({
        newState
      })
      var getMatchName = {
        user_id: this.props.match.params.id
      }
      this.socket.emit('user get', getMatchName);
    });
  }

  componentWillUnmount() {
    const unlisten = this.unlisten
    unlisten()
  }

  onConnect(){
    console.log(this.props);
    var getMatchName = {
      user_id: this.props.match.params.id
    }
    this.socket.emit('user get', getMatchName);
    var newState = this.state;
    newState.preventHistoryPush = 1;
    newState.conected = true;
    this.setState({
      newState
    })
  }

  onDisconnect(){
    var newState = this.state;
    newState.conected = false;
    this.setState({
      newState
    })
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

  onGetUser(user){
   if(user.User_Id !== "") {
      this.props.setUserView(user.Firstname, user.Lastname, user.User_Id);
      var newState = this.state;
      newState.userViewId = user.User_Id;
      newState.userPath = '/view'
      this.socket.emit('posts get', user);
      this.socket.emit('profile picture get', user);
      if(newState.preventHistoryPush === 0) {
        this.props.history.push(`/view/${user.User_Id}`)
      }
      newState.preventHistoryPush = 0;
      UserView.setState({
        newState
      });
    }

  }

  onGetProfilePicture(blob) {
    if(blob !== '') {
      this.props.addUserViewPP(blob.Data);
    } else {
      this.props.addUserViewPP(require("../Images/DefaultAvatar.png"));
      }

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
    email: state.email,
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


export default withRouter(connect(mapStateToProps, matchDispachToProps)(UserView));
