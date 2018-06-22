import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import "../Images/star.png"
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {Row, Col } from 'react-flexbox-grid';
import {List} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import TimeAgo from 'react-timeago';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';

export class UserPostView extends React.Component {

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
        this.getLikesAndDislikesTotals(this.props.post_ids)
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
    axios.post('http://localhost:8000/plush-api/dislike', JSON.stringify(ids), {headers: {'Authorization': this.props.access_token}}).then(res2 => {
      if('Error' in res2.data) {
        console.log(res2.Data.Error);
      } else {
        this.props.onLikeOrDislike(res2.data)
        this.getLikesAndDislikesTotals(this.props.post_ids)
      }
    }).catch(err => {
      console.log("Error: " + err);
    })
  }

  getLikesAndDislikesTotals = (post_ids) => {
    axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + post_ids, {headers: {'Authorization': this.props.access_token}}).then(res3 => {
      if('Error' in res3.data) {
        console.log(res3.Data.Error)
      } else {
        let data = res3.data
        this.props.onLikeAndDislikeTotals(data);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
      let posts = this.props.posts
      if(posts !== null) {
        posts = this.props.posts.map((post, index) => (
          <Row style={{margin:"1% 0"}}key={uuid.v4()}>
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                  <Card style={{borderRadius: "25px", margin:"0px 1%",fontFamily:"Risque"}}>
                    <CardHeader
                      title={<div style={{color: "#173777"}}>{this.props.display_name}</div>}
                      subtitle={<TimeAgo date={this.props.post_times[index]} />}
                      avatar={this.props.profile_picture}
                    />
                    {this.props.typesOfPosts[index] == 0 ?
                      <CardText
                        style={{marginLeft:"1%", wordWrap: 'break-word', color:"#FF5522"}}
                        >
                        {post}
                      </CardText>
                    :
                      <div>
                        <Row center="xs">
                          <Col xs={12}>
                            <img src={post} style={{width: "100%", height: "100%", margin: "0px auto"}}/>
                          </Col>
                        </Row>
                        <Row start="xs" style={{padding:"10px 0px"}}>
                          <Col xs={12}>
                            <Typography style={{margin:"0px 12.5%", fontSize:"16px", color: "#173777", fontFamily:"Risque"}}>
                              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                              across all continents except Antarctica
                            </Typography>
                          </Col>
                        </Row>
                      </div>
                    }
                    <CardActions>
                      <FlatButton label="Comment" style={{fontFamily:"Risque", color: "#173777"}}/>
                      <FlatButton
                        label="Like"
                        backgroundColor={this.props.postsLikes[index] === 1 ? "#FF5522" : "#FFFFFF"}
                        onClick={() => this.onLikeClick(this.props.user_id, this.props.post_ids[index])}
                        style={{fontFamily:"Risque", color: this.props.postsLikes[index] === 1 ? "#FFFFFF" : "#173777"}}
                        />
                      <FlatButton
                        label="Dislike"
                        backgroundColor={this.props.postsDislikes[index] === 1 ? "#173777" : "#FFFFFF"}
                        onClick={() => this.onDislikeClick(this.props.user_id, this.props.post_ids[index])}
                        style={{fontFamily:"Risque", color: this.props.postsDislikes[index] === 1 ? "#FFFFFF" : "#173777"}}
                        />
                        <Button style={{height: "100%", width: "35px", float: "right", color: "#173777", backgroundColor:"white"}} variant="fab"  aria-label="totalDislikes">
                          {this.props.postsDislikeTotals[index]}
                        </Button>
                        <Button style={{height: "100%", width: "35px", float: "right", backgroundColor:"white"}} variant="fab" disabled aria-label="totalDislikesIcon">
                            <ThumbDown style={{color: "#173777"}}/>
                        </Button>
                        <Button style={{height: "100%", width: "35px", float: "right", color: "#FF5522", backgroundColor:"white"}} variant="fab" aria-label="totalLikes">
                          {this.props.postsLikeTotals[index]}
                        </Button>
                        <Button style={{height: "100%", width: "35px", float: "right", backgroundColor: "white"}} variant="fab" disabled aria-label="totalLikesIcon">
                            <ThumbUp style={{color: "#FF5522"}}/>
                        </Button>
                    </CardActions>
                  </Card>
                  </Col>
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

      // const posts = this.props.posts.map((post, index) => (
      //   <div className= 'row' key={uuid.v4()}>
      //   <div className= 'fourteen wide column'>
      //   <div className= 'ui segment Border-blue'>
      //     <div className='comment'>
      //       <div className="content">
      //         <a className="author">{this.props.displayName}</a>
      //         <div className="metadata">
      //           <div className="date">{this.props.post_times[index]}</div>
      //         </div>
      //         <div className="text">
      //           {post}
      //         </div>
      //       </div>
      //     </div>
      //     </div>
      //   </div>
      //     <div className= 'two wide column Row-height center aligned middle aligned'>
      //       <Popup
      //         trigger={<Image src={require("../Images/star.png")} avatar />}
      //         content="Rate Post"
      //         />
      //     </div>
      //   </div>
      // ));
      // return (
      //   <div className='ui comments'>
      //   <div className= 'ui grid'>
      //     {posts}
      //     </div>
      //   </div>
      // );
    }
  }

export default UserPostView;
