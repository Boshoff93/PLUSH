import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import { createStore } from 'redux';
import Socket from './socket.js'


function reducer(state, action) {
  if (action.type === 'ADD_POST') {
    return {
      posts: state.posts.concat(action.post),
    };
  } else if (action.type === 'DELETE_POST') {
    return {
      posts: [
        ...state.posts.slice(0, action.index),
        ...state.posts.slice(
          action.index + 1, state.posts.length
        ),
      ],
    };
  } else {
    return state;
  }
}

const initialState = {
  userName: '',
  posts: []
  //TODO once posts are written to and from the database, impliment timestamps into posts
};

const store = createStore(reducer, initialState);

class Profile extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());

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
    const posts = store.getState().posts;

    return (
      <div className="ui center aligned container"
        style={{fontFamily:'Risque', fontSize: '25px', color:'orange' }}
      >
      PLUSH WALL POSTS
      <div className='ui left aligned segment'
      style={{fontFamily:'Risque', fontSize: '25px', marginTop: '20px', color:'black' }}>
        <PostView
          posts={posts}
          store ={store}
        />
        <div className='ui right aligned segment'>
        <PostInput
          store ={store}
        />
        </div>
      </div>
      </div>
    );
  }
}

export default Profile;
