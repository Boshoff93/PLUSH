import React from 'react';
import {bindActionCreators} from 'redux'
import {deletePost} from '../actions/deletePost';
import {connect} from 'react-redux'

export class PostView extends React.Component {

  render() {
    const posts = []||this.props.posts.map((post, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.props.deletePost(index)}
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

function matchDispachToProps(dispatch) {
  return bindActionCreators({deletePost: deletePost}, dispatch)
}

export default connect(null, matchDispachToProps)(PostView);
