import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import "../Images/trash-bin.png"
import "../Images/star.png"
import {Image, Popup} from 'semantic-ui-react'
import axios from 'axios';



export class PostView extends React.Component {

  handleDelete = (index) => {
    let deletePost = {
      user_id: this.props.user_id,
      post_id: this.props.post_ids[index],
    }

    axios.delete('http://localhost:8000/plush-api/post', {data: JSON.stringify(deletePost), headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        this.props.onDeletePost(index);
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  };

  render() {
      let posts = this.props.posts
      if(posts !== null) {
        posts = this.props.posts.map((post, index) => (
        <div className= 'row' key={uuid.v4()}>
        <div className= 'fourteen wide column'>
        <div className= 'ui segment Border-blue'>
          <div className='comment'>
            <div className="content">
              <a className="author">{this.props.display_name}</a>
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
        <div className= 'two wide column Row-height center aligned'>
          <div className='row Row-height-half'>
            <Popup
              trigger={<Image className="shake-it" onClick={()=> this.handleDelete(index)} src={require("../Images/trash-bin.png")} avatar />}
              content="Delete Post"
              />
          </div>
          <div className='row Row-height-half'>
            <Popup
              trigger={<Image src={require("../Images/star.png")} avatar />}
              content="Rate Post"
              />
          </div>
          </div>
        </div>
      ));
      }
      return (
        <div className='ui comments'>
        <div className= 'ui grid'>
          {posts}
          </div>
        </div>
      );
    }
  }



export default PostView;
