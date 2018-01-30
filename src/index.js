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
        ...state, ...state.posts.concat(action.post),
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
        ...state, userName: action.name, posts: action.name,
      }
    }
    case 'REPLACE_POSTS': {
      return {
        ...state, posts: action.posts
      }
    }
    default: {
      return state;
    }

  }

}

const persistedState = loadState();
const store = createStore(reducer, persistedState);
store.subscribe(() => {
  saveState(store.getState());
})

store.subscribe(() => {
  console.log(store.getState());
})


ReactDOM.render(
    <App store = {store}/>,
  document.getElementById('root')
);
registerServiceWorker();
