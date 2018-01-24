import React from 'react';
import MessageView from './MessageView';
import MessageInput from './MessageInput';

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const subscribe = (listener) => (
    listeners.push(listener)
  );

  const getState = () => (state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(l => l());
  };

  return {
    subscribe,
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    return {
      messages: state.messages.concat(action.message),
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    return {
      messages: [
        ...state.messages.slice(0, action.index),
        ...state.messages.slice(
          action.index + 1, state.messages.length
        ),
      ],
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

class Profile extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const messages = store.getState().messages;

    return (
      <div className="ui center aligned container"
        style={{fontFamily:'Risque', fontSize: '25px', color:'orange' }}
      >
      PLUSH WALL POSTS
      <div className='ui left aligned segment'
      style={{fontFamily:'Risque', fontSize: '25px', marginTop: '20px', color:'black' }}>
        <MessageView
          messages={messages}
          store ={store}
        />
        <div className='ui right aligned segment'>
        <MessageInput
          store ={store}
        />
        </div>
      </div>
      </div>
    );
  }
}

export default Profile;
