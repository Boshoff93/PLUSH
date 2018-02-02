import React from 'react';
import {bindActionCreators} from 'redux'
import {deletePost} from '../actions/deletePost';
import {connect} from 'react-redux'
import uuid from 'uuid';

export class PostView extends React.Component {

  handleDelete = (index) => {
    let deletePost = {
      user_id: this.props.user_id,
      post_id: this.props.post_ids[index],
    }
    this.props.socket.emit('post delete', deletePost);
    this.props.deletePost(index);
  };

  render() {
    const posts = this.props.posts.map((post, index) => (
      <div className= 'row'>
      <div className= 'fifteen wide column'>
      <div className= 'ui segment'
        key={uuid.v4()}
        onClick={() => this.handleDelete(index)}
        >
        <div className='comment'>
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
      </div>
      <div className= 'one wide column'>
        <button class="circular ui icon button">
          <i class="icon settings"></i>
        </button>

      </div>

      </div>
    ));
    return (

      <div className='ui comments'>
      <div className= 'ui grid'>
        {posts}
        </div>
      </div>
    );
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({deletePost: deletePost}, dispatch)
}

export default connect(null, matchDispachToProps)(PostView);
