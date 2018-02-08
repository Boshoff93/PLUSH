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
import {Redirect,withRouter} from 'react-router-dom'

class UserView extends React.Component {
  state = {
    conected: false,
    userPath: '',
    userViewName: '',
    preventHistoryPush: 0,
  }

  componentDidMount() {
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('posts get', this.onGetPosts.bind(this));
    socket.on('get user', this.onGetUser.bind(this));
    socket.on('error', this.onError.bind(this));
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));

    const unlisten = this.unlisten = this.props.history.listen((location, action) => {
      var newState = this.state;
      newState.preventHistoryPush = 1;
      this.setState({
        newState
      })
      var getMatchName = {
        name: this.props.match.params.name
      }
      this.socket.emit('get user', getMatchName);


    });
  }

  componentWillUnmount() {
    const unlisten = this.unlisten
    unlisten()
  }

  onConnect(){
    var getMatchName = {
      name: this.props.match.params.name
    }
    this.socket.emit('get user', getMatchName);
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
      this.props.setUserView(user.Name, user.User_Id);
      var newState = this.state;
      newState.userViewName = user.Name;
      newState.userPath = '/view'
      this.socket.emit('posts get', user);
      if(newState.preventHistoryPush === 0) {
        this.props.history.push(`/view/${user.Name}`)
      }
      newState.preventHistoryPush = 0;
      UserView.setState({
        newState
      });
    }

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
              userName={this.props.userName}
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
    userName: state.userName,
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
