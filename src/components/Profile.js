import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import Socket from './socket.js';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {replacePosts} from '../actions/replacePosts';
import {connect} from 'react-redux'
import '../App.css'

class Profile extends React.Component {

  state = {
    connected: false,
  }


  componentDidMount() {
    //store.subscribe(() => this.forceUpdate());
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    socket.on('post add', this.onAddPost.bind(this));
    socket.on('posts get', this.onGetPosts.bind(this));
    socket.on('error', this.onError.bind(this));
    socket.on('connect', this.onConnect.bind(this));
    socket.on('disconnect', this.onDisconnect.bind(this));
  }

  onConnect(){
    let user = {
      userName: this.props.userName,
      id: this.props.id
    }
    this.socket.emit('posts get', user);

    this.setState({connected: true});
  }

  onDisconnect(){
    this.setState({connected: false});
  }

  onGetPosts(posts) {
    //console.log(posts)
    //console.log(posts)
    //console.log("^^^^^^^^^^^^^^")
    this.props.replacePosts(posts)
    //console.log(this.props.posts)
    //console.log("^^^^^^^^^^^^^^")
  }

  onAddPost(post) {
    this.props.addPost(post.Post);
  }

  onError(error){
    //do nothing
  }

  render() {

    return (
      <div className="ui center aligned container">

      <div className= 'ui grid'>

        <div className='four wide centered column'>
          {this.props.userName}
        </div>

        <div className='twelve wide centered column'>
          <div className='Plush-blue Plush-font'>
            PLUSH WALL POSTS
          </div>
          <div className='ui left aligned segment'
          style={{marginTop: '20px', color:'black' }}>
            <PostView
              posts={this.props.posts}
            />
            <div className='ui right aligned segment'>
            <PostInput
              socket={this.socket}
              id={this.props.id}
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
    userName: state.userName,
    posts: state.posts,
    id: state.id,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    replacePosts: replacePosts
  }, dispatch)
}


export default connect(mapStateToProps, matchDispachToProps)(Profile);
