import React from 'react';

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
    this.props.store.dispatch({
      type: 'ADD_POST',
      post: this.state.value,
    });
    this.setState({
      value: '',
    });
  };

  render() {
    return (
      <div className='ui fluid input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          style={{backgroundColor:'orange', color: 'black' }}
          type='submit'
        >
          Submit
        </button>
       </div>
    );
  }
}

export default PostInput
