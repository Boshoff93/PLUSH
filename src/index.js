import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import "./semantic-dist/semantic.css";
import App from './components/App';
import { createStore } from 'redux';

function reducer(state = {
  userName:'',
  posts: [],
}, action) {

  switch (action.type) {
    case 'ADD_POST': {
      return {
        ...state, posts: state.posts.concat(action.post),
      };
    }
    case 'DELETE_POST':{
      return {
        posts: [
          ...state.posts.slice(0, action.index),
          ...state.posts.slice(
            action.index + 1, state.posts.length
          ),
        ],
      };
    }
    case 'SET_USER' :{
      console.log(state.userName);
      return {
        ...state, userName: action.name,
      }

    }
    default: {
      return state;
    }

  }

}


const store = createStore(reducer);

ReactDOM.render(
    <App store = {store}/>,
  document.getElementById('root')
);
registerServiceWorker();
