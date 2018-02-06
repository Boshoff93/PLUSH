import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import "../Images/star.png"

export class UserPostView extends React.Component {

  render() {
      const posts = this.props.posts.map((post, index) => (
        <div className= 'row' key={uuid.v4()}>
        <div className= 'twelve wide column'>
        <div className= 'ui segment Border-blue'>
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
            <button className="Button-wallpost-format" data-tooltip="Rate Post" data-inverted="">
              <img className="ui avatar image Button-wallpost-padding" src={require("../Images/star.png")}></img>
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

export default UserPostView;
