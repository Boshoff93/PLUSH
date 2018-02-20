import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import "../Images/star.png"
import {Image, Popup} from 'semantic-ui-react'

export class UserPostView extends React.Component {

  render() {
      const posts = this.props.posts.map((post, index) => (
        <div className= 'row' key={uuid.v4()}>
        <div className= 'fourteen wide column'>
        <div className= 'ui segment Border-blue'>
          <div className='comment'>
            <div className="content">
              <a className="author">{this.props.displayName}</a>
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
          <div className= 'two wide column Row-height center aligned middle aligned'>
            <Popup
              trigger={<Image src={require("../Images/star.png")} avatar />}
              content="Rate Post"
              />
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
