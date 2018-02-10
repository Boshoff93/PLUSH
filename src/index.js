import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import "./semantic-dist/semantic.css";
import App from './components/App';
import { createStore } from 'redux';
import {loadState, saveState} from './components/localStorage';

function reducer(state = {
  userName:'',
  user_id:'',
  post_ids: [],
  post_times: [],
  posts: [],
  profile_picture: '',

  userView : {
    userViewProfilePicture:'',
    userViewName:'',
    userViewId: '',
    userViewPostTimes: [],
    userViewPosts: [],
  }

}, action) {

  switch (action.type) {
    case 'ADD_POST': {
      return {
          ...state,
          posts: [action.post].concat(state.posts),
          post_times: [action.post_time].concat(state.post_times),
          post_ids: [action.post_id].concat(state.post_ids),

      };
    }
    case 'DELETE_POST': {
      return {
        ...state, posts: [
                    ...state.posts.slice(0, action.index),
                    ...state.posts.slice(action.index + 1, state.posts.length),
                  ],
                  post_times: [
                    ...state.post_times.slice(0, action.index),
                    ...state.post_times.slice(action.index + 1, state.post_times.length),
                  ],
                  post_ids: [
                    ...state.post_ids.slice(0, action.index),
                    ...state.post_ids.slice(action.index + 1, state.post_ids.length),
                  ]
      };
    }
    case 'SET_USER': {
      return {
        ...state, userName: action.name, user_id: action.user_id,
      }
    }
    case 'REPLACE_POSTS': {
      return {
        ...state, posts: action.posts, post_times: action.post_times,
                  post_ids: action.post_ids
      }
    }
    case 'SET_USER_VIEW': {
      return {
        ...state, userView: { ...state.userView,
           userViewName: action.name,
           userViewId: action.user_id,
         }

      }
    }
    case 'REPLACE_USER_VIEW_POSTS': {
      return {
        ...state, userView: { ...state.userView,
           userViewPosts: action.posts,
           userViewPostTimes: action.post_times,
         }
       }
    }

    case 'ADD_PROFILE_PICTURE': {
      return {
        ...state, profile_picture: action.profile_picture
      }
    }

    case 'ADD_USER_VIEW_PROFILE_PICTURE': {
      return {
        ...state, userView: { ...state.userView,
           userViewProfilePicture: action.profile_picture,
         }
      }
    }
    
    default: {
      return state;
    }

  }

}

//saveState({userName:'', id:'', posts:[]});
const persistedState = loadState();
const store = createStore(reducer, persistedState);

store.subscribe(() => {
  saveState(store.getState());
  console.log(store.getState());
})

//store.subscribe(() => this.forceUpdate());


ReactDOM.render(
    <App store = {store}/>,
  document.getElementById('root')
);
registerServiceWorker();
