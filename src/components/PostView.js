import React from 'react';
import {bindActionCreators} from 'redux'
import {deletePost} from '../actions/deletePost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import "../Images/trash-bin.png"
import "../Images/star.png"

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
        <div className= 'twelve wide column'>
        <div className= 'ui segment'
          key={uuid.v4()}
          style={{border:"1px solid #0080ff"}}
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

        {/*TODO:Fix this mess*/}
          <div className= 'two wide column Row-height center aligned'>
            <button data-tooltip="Delete Post" data-inverted="" style={{backgroundColor:"white", borderRadius:"100%", border:"2px solid orange", margin:"25% 20%", padding:"0 10%"}}
              onClick={() => this.handleDelete(index)}
            >
              <img className="ui avatar image" src={require("../Images/trash-bin.png")} style={{padding:"30% 0px"}}></img>
            </button>
          </div>
          <div className= 'two wide column Row-height center aligned'>
            <button data-tooltip="Rate Post" data-inverted="" style={{backgroundColor:"white", borderRadius:"100%", border:"2px solid orange", margin:"25% 20%", padding:"0 10%"}}>
              <img className="ui avatar image" src={require("../Images/star.png")} style={{padding:"30% 0px"}}></img>
            </button>
          </div>
        </div>
      ));
      return (
        <div className='ui comments' style={{margin: "0 auto"}}>
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
