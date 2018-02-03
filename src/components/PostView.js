import React from 'react';
import {bindActionCreators} from 'redux'
import {deletePost} from '../actions/deletePost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../animations/animations.css"

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
        <div className= 'fourteen wide column'>
        <div className= 'ui segment'
          key={uuid.v4()}
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
        <div className= 'two wide column'>
          <button className="circular ui icon button shake-it poop" data-tooltip="Delete Post"
            onClick={() => this.handleDelete(index)}
            >
            <i className="icon trash"></i>
          </button>
        </div>

        </div>
      ));
      return (

        <div className='ui comments'>
        <div className= 'ui middle aligned grid'>
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
