import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import Socket from './socket.js';
import {connect} from 'react-redux'
import '../App.css'

class Profile extends React.Component {

  componentDidMount() {
    //store.subscribe(() => this.forceUpdate());
    let ws = new WebSocket('ws://localhost:4000')
    let socket = this.socket = new Socket(ws);
    // socket.on('connect', this.onConnect.bind(this));
    // socket.on('disconnect', this.onDisconnect.bind(this));
    // socket.on('user add', this.onAddUser.bind(this));
    // socket.on('username availible', this.onFindUserUnSuccessful.bind(this));
    // socket.on('username unavailible', this.onAddUser.bind(this));
    // socket.on('error', this.onError.bind(this));

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
    posts: state.posts,
    userName: state.userName

  }
}


export default connect(mapStateToProps, null)(Profile);
