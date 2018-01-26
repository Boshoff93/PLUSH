import React from 'react';

export class PostView extends React.Component {
  handleClick = (index) => {
    this.props.store.dispatch({
      type: 'DELETE_POST',
      index: index,
    });
  };

  render() {
    const posts = this.props.posts.map((post, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {post}
      </div>
    ));
    return (
      <div className='ui comments'>
        {posts}
      </div>
    );
  }
}

export default PostView
