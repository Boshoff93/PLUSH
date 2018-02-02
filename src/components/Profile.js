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
    if(posts.Posts === null) {
      this.props.replacePosts([],[],[])
    } else {
      this.props.replacePosts(posts.Posts, posts.Post_Times, posts.Post_Ids)
    }
  }

  onAddPost(post) {
    this.props.addPost(post.Post, post.Post_Time, post.Post_Id);
  }

  onError(error){
    //do nothing
  }

  render() {

    return (
      <div className="ui container">

      <div className="ui grid">
        <div className="four wide column">
          <div className="ui segment center aligned">
            {this.props.userName}
          </div>
        </div>
        <div className="twelve wide column">
          <div className="ui segment center aligned">
            <div className='Plush-blue Plush-font' style={{marginTop: '10px'}}>
                PLUSH WALL POSTS
              </div>
              <div className='ui right aligned segment'>
              <PostInput
                socket={this.socket}
                user_id={this.props.user_id}
              />
              <div className='ui left aligned segment'
              style={{marginTop: '20px', color:'black' }}>
                <PostView
                  socket={this.socket}
                  posts={this.props.posts}
                  post_ids={this.props.post_ids}
                  post_times={this.props.post_times}
                  userName={this.props.userName}
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
    post_ids: state.post_ids,
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
