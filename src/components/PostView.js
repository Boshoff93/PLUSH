import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import axios from 'axios';
import {Row, Col } from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {List} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import TimeAgo from 'react-timeago';


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
        style={{marginTop: "0px"}}
        touch={true}
        tooltipPosition="bottom-left"
      >
      <MoreVertIcon color="#173777"/>
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
        style={{backgroundColor: "#173777", color:"white",fontFamily:"Risque"}}
        onClick={()=> this.handleDelete(index)}
      >
        Delete
      </MenuItem>
      </IconMenu>
    )
  };

  onLikeClick = (user_id, post_id) => {
    let ids = {
      user_id: user_id,
      post_id: post_id
    }
    axios.post('http://localhost:8000/plush-api/like', JSON.stringify(ids), {headers: {'Authorization': this.props.access_token}}).then(res1 => {
      if('Error' in res1.data) {
        console.log(res1.Data.Error);
      } else {
        this.props.onLikeOrDislike(res1.data)

        axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + this.props.post_ids, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
          if('Error' in res2.data) {
            console.log(res2.Data.Error)
          } else {
            let data = res2.data
            this.props.onLikeAndDislikeTotals(data);
          }
        }).catch(err => {
          console.log(err);
        })
      }

    }).catch(err => {
      console.log("Error: " + err);
    })

  }

  onDislikeClick = (user_id, post_id) => {
    let ids = {
      user_id: user_id,
      post_id: post_id
    }
    axios.post('http://localhost:8000/plush-api/dislike', JSON.stringify(ids), {headers: {'Authorization': this.props.access_token}}).then(res3 => {
      if('Error' in res3.data) {
        console.log(res3.Data.Error);
      } else {
        this.props.onLikeOrDislike(res3.data)

        axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + this.props.post_ids, {headers: {'Authorization': this.props.access_token}}).then(res4 => {
          if('Error' in res4.data) {
            console.log(res4.Data.Error)
          } else {
            let data = res4.data
            this.props.onLikeAndDislikeTotals(data);
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }).catch(err => {
      console.log("Error: " + err);
    })
  }

  render() {

      let posts = this.props.posts
      if(posts !== null) {
        posts = this.props.posts.map((post, index) => (
          <Row style={{margin:"1% 0"}}key={uuid.v4()}>
              <Col xs={11}>
                <Row>
                  <Col xs={12}>
                  <Card style={{borderRadius: "25px", marginLeft:"1%",fontFamily:"Risque"}}>
                    <CardHeader
                      title={<div style={{color: "#173777"}}>{this.props.display_name}</div>}
                      subtitle={<TimeAgo date={this.props.post_times[index]} />}
                      avatar={this.props.profile_picture}
                    />
                    <CardText style={{marginLeft:"1%", wordWrap: 'break-word', color:"#FF5522"}}>
                      {post}
                    </CardText>
                    <CardActions>
                      <FlatButton label="Comment" style={{fontFamily:"Risque", color: "#173777"}}/>
                      <FlatButton
                        label="Like"
                        backgroundColor={this.props.postsLikes[index] === 1 ? "#173777" : "#FFFFFF"}
                        onClick={() => this.onLikeClick(this.props.user_id, this.props.post_ids[index])}
                        style={{fontFamily:"Risque", color: this.props.postsLikes[index] === 1 ? "#FFFFFF" : "#173777"}}
                        />
                      <FlatButton
                        label="Dislike"
                        backgroundColor={this.props.postsDislikes[index] === 1 ? "#173777" : "#FFFFFF"}
                        onClick={() => this.onDislikeClick(this.props.user_id, this.props.post_ids[index])}
                        style={{fontFamily:"Risque", color: this.props.postsDislikes[index] === 1 ? "#FFFFFF" : "#173777"}}
                        />
                    </CardActions>
                  </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={1}>
                <Row center="xs">
                    {this.rightIconMenu(index)}
                </Row>
              </Col>
          </Row>
      ));
      }
      if(!{posts}.length) {
        return (
          <List>
            {posts}
          </List>
        );
      } else {
        return (
          <div>
          </div>
        )
      }
    }
  }



export default PostView;
