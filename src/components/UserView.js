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
import {connect} from 'react-redux';
import '../App.css';
import {Redirect, withRouter} from 'react-router-dom'

class UserView extends React.Component {
  state = {
    conected: false,
    userPath: '',
    userViewName: '',
  }

  componentDidMount() {
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('posts get', this.onGetPosts.bind(this));
    socket.on('get user', this.onGetUser.bind(this));
    socket.on('error', this.onError.bind(this));
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
  }

  onConnect(){
    let user = {
      userViewName: this.props.userView.userViewName,
      user_id: this.props.userView.userViewId
    }
    this.socket.emit('posts get', user);

    this.setState({connected: true});
  }

  onDisconnect(){
    this.setState({connected: false});
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
   if(user.User_Id != "") {
      this.props.setUserView(user.Name, user.User_Id);
      var newState = this.state;
      newState.userViewName = user.Name;
      newState.userPath = '/view'

      this.socket.emit('posts get', user);

      this.props.history.push(`/view/${user.Name}`)
      this.setState({
        newState
      });
    }

  }

  handleViewChange() {
    this.props.match.params.name = this.state.userViewName

    let user = {
      userViewName: this.props.userView.userViewName,
      user_id: this.props.userView.userViewId
    }

    this.socket.emit('posts get', user);
    this.props.match.params.name = user.userViewName
    this.props.history.push(`/view/${user.userViewName}`)
    var reloadPage = this.state;
    reloadPage.userPath = ''
    this.setState({
      reloadPage
    });
  }

  render() {
    return (
      <div className="ui container">
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui segment center aligned Border-orange">
            {this.props.userView.userViewName}
          </div>
          <div>
            <SearchUser
              socket={this.socket}
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
                  userName={this.props.userView.userViewName}
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
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    setUserView: setUserView,
    replaceUserViewPosts: replaceUserViewPosts,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(UserView));
