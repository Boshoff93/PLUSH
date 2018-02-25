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
import {Row, Col } from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';


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


        iconButtonElement(){
          return (
          <IconButton
            touch={true}
            tooltipPosition="bottom-left"
          >
            <MoreVertIcon color={{color: "white"}} />
          </IconButton>
        )
        };
        rightIconMenu(index) {
          return (
          <IconMenu
            iconButtonElement={this.iconButtonElement()}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            <MenuItem
              onClick={()=> this.handleDelete(index)}
            >
              Delete</MenuItem>
          </IconMenu>
        )
        };

  render() {
      let posts = this.props.posts
      if(posts !== null) {
        posts = this.props.posts.map((post, index) => (
          <Row center="xs">
          <Paper style={{width: "95%", borderRadius: "25px"}} zDepth={3}>
            <Row>
              <Col xs={10}>
                <Row>
                  <ListItem
                    style={{width: "100%"}}
                    disabled={true}
                    primaryText={this.props.display_name}
                    secondaryText={
                      <p>
                        <span style={{color: "black"}}>{post}</span><br />
                        {this.props.post_times[index]}
                      </p>
                    }
                  />
                </Row>
              </Col>
              <Col xs={2}>
                <Row center="xs">
                  {this.rightIconMenu(index)}
                </Row>
              </Col>
            </Row>
          </Paper>
          </Row>
        // <div className= 'row' key={uuid.v4()}>
        // <div className= 'fourteen wide column'>
        // <div className= 'ui segment Border-blue'>
        //   <div className='comment'>
        //     <div className="content">
        //       <a className="author">{this.props.display_name}</a>
        //       <div className="metadata">
        //         <div className="date">{this.props.post_times[index]}</div>
        //       </div>
        //       <div className="text">
        //         {post}
        //       </div>
        //     </div>
        //   </div>
        //   </div>
        // </div>
        // <div className= 'two wide column Row-height center aligned'>
        //   <div className='row Row-height-half'>
        //     <Popup
        //       trigger={<Image className="shake-it" onClick={()=> this.handleDelete(index)} src={require("../Images/trash-bin.png")} avatar />}
        //       content="Delete Post"
        //       />
        //   </div>
        //   <div className='row Row-height-half'>
        //     <Popup
        //       trigger={<Image src={require("../Images/star.png")} avatar />}
        //       content="Rate Post"
        //       />
        //   </div>
        //   </div>
        // </div>
      ));
      }
      return (

              <List>
                {posts}
              </List>

      //   <div className='ui comments'>
      //   <div className= 'ui grid'>
      //     {posts}
      //     </div>
      //   </div>
      );
    }
  }



export default PostView;
