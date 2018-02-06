import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';

export class PostInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    if(this.state.value !== ""){
      let post = {
        user_id: this.props.user_id,
        post_id: uuid.v1().toString(),
        post: this.state.value

      }
      this.props.socket.emit('post add', post);
      this.setState({
        value: '',
      });
    }
  };

  render() {
    return (
      <div className='ui fluid input'>
        <input className = 'Border-blue'
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={() => this.handleSubmit()}
          className='ui inverted orange button'
          type='submit'
        >
          Submit
        </button>
       </div>
    );
  }
}


export default PostInput
