import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import { createStore, combineReducers } from 'redux';
import {loadState, saveState} from './components/localStorage';
import {userReducer} from './components/reducers/UserReducer';
import {userViewReducer} from './components/reducers/UserViewReducer';
import {homeReducer} from './components/reducers/HomeReducer';

const reducer = combineReducers({
  user: userReducer,
  userView: userViewReducer,
  home: homeReducer,
});

//saveState();
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
