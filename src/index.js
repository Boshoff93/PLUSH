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
  id:'',
  posts: [],
}, action) {

  switch (action.type) {
    case 'ADD_POST': {
      return {
          ...state, posts: state.posts.concat(action.post),

      };
    }
    case 'DELETE_POST': {
      return {
        posts: [
          ...state.posts.slice(0, action.index),
          ...state.posts.slice(
            action.index + 1, state.posts.length
          ),
        ],
      };
    }
    case 'SET_USER': {
      return {
        ...state, userName: action.name, id: action.id,
      }
    }
    case 'REPLACE_POSTS': {
      return {
        ...state, ...state.posts, posts: action.posts
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
