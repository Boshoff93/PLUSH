import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import ImageUpload from './ImageUpload'
import Socket from './socket.js';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {replacePosts} from '../actions/replacePosts';
import {connect} from 'react-redux';
import '../App.css';

class Profile extends React.Component {

  state = {
    connected: false,
  }


  componentDidMount() {

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
      user_id: this.props.user_id
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
    if(posts.Posts === null) {
      this.props.replacePosts([],[])
    } else {
      this.props.replacePosts(posts.Posts, posts.Post_Ids)
    }

    //console.log(this.props.posts)
    //console.log("^^^^^^^^^^^^^^")
  }

  onAddPost(post) {
    console.log(post.Post_Id);
    this.props.addPost(post.Post, post.Post_Id);
  }

  onError(error){
    //do nothing
  }

  render() {

    return (
      <div className="ui container">

      <div className="ui right aligned grid">
        <div className="right floated left aligned four wide column">
          <div className="ui segment center aligned">
            {this.props.userName}
          </div>
        </div>
        <div className="left floated right aligned twelve wide column">
          <div className="ui segment center aligned">
            <div className='Plush-blue Plush-font' style={{marginTop: '10px'}}>
                PLUSH WALL POSTS
              </div>
              <div className='ui left aligned segment'
              style={{marginTop: '20px', color:'black' }}>
                <PostView
                  posts={this.props.posts}
                  post_times={this.props.post_times}
                  userName={this.props.userName}
                />
                <div className='ui right aligned segment'>
                <PostInput
                  socket={this.socket}
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
    userName: state.userName,
    posts: state.posts,
    post_times: state.post_times,
    user_id: state.user_id,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    replacePosts: replacePosts
  }, dispatch)
}


export default connect(mapStateToProps, matchDispachToProps)(Profile);
