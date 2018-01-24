import React from 'react';

export class MessageView extends React.Component {
  handleClick = (index) => {
    this.props.store.dispatch({
      type: 'DELETE_MESSAGE',
      index: index,
    });
  };

  render() {
    const messages = this.props.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {message}
      </div>
    ));
    return (
      <div className='ui comments'>
        {messages}
      </div>
    );
  }
}

export default MessageView
