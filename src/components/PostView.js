import React from 'react';
import {bindActionCreators} from 'redux'
import {deletePost} from '../actions/deletePost';
import {connect} from 'react-redux'
import uuid from 'uuid';

export class PostView extends React.Component {

  render() {
    const posts = this.props.posts.map((post, index) => (
      <div className= 'ui segment' key={uuid.v4()}>
        <div className='comment'
          onClick={() => this.props.deletePost(index)}
          >
          <div className="content">
            <a className="author">{this.props.userName}</a>
            <div className="metadata">
              <div className="date">{this.props.post_times[index]}</div>
            </div>
            <div className="text">
              {post}
            </div>
          </div>
        </div>
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
