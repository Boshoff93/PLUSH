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
import {replaceHomePosts} from "../actions/replaceHomePosts";
import {Redirect} from 'react-router-dom'
import { withRouter } from 'react-router'
import axios from 'axios';
import TimeAgo from 'react-timeago';
import {replacePageTitle} from '../actions/replacePageTitle'
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Button from '@material-ui/core/Button'
import {replaceHomePostsLikesDislikes} from '../actions/replaceHomePostsLikesDislikes'
import {replaceHomePostsLikesAndDislikesTotals} from '../actions/replaceHomePostsLikesAndDislikesTotals'
import CircularProgress from '@material-ui/core/CircularProgress';


export class Home extends React.Component {
  state = {
    homePostsLikes: this.props.home_posts_likes,
    homePostsDislikes: this.props.home_posts_dislikes,
    homePostsLikeTotals: this.props.home_posts_likes_totals,
    homePostsDislikeTotals: this.props.home_posts_dislikes_totals,
    loading: true,

  }

  componentDidMount() {
    axios.get('http://localhost:8000/plush-api/getAllFollowPosts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res1 => {
      if('Error' in res1.data) {
        console.log(res1.Data.Error);
      } else {
        let data = res1.data
        let profilePictures = []
        axios.get('http://localhost:8001/plush-file-server/searchedUserProfilePictures/' + data.Pp_Names, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
          if(res2.data != null) {
            if('Error' in res2.data) {
              console.log(res2.data.Error);
            } else {
              for (var i = 0; i < data.Following_Ids.length; i++) {
                for (var j = 0; j < Object.keys(data.Pp_Names).length; j++) {
                  if(data.Following_Ids[i] === data.Unique_Following_Ids[j]) {
                    profilePictures.push(res2.data.Data[j]);
                  }
                }
              }
            }
          }
          this.onGetFollowingPosts(data, profilePictures)
      }).catch(err => {
        console.log(err);
      })
    }
    }).catch(err => {
      console.log(err);
    })
    this.props.replacePageTitle("HOME")
  }

  onLikeOrDislike = (posts_likes_dislikes) => {
    let newState = this.state
    if(posts_likes_dislikes.Likes === null && posts_likes_dislikes.Dislikes === null) {
      this.props.replaceHomePostsLikesDislikes([], [])
      newState.homePostsLikes = []
      newState.homePostsDislikes = []

      this.setState({
        newState
      })
      return
    } else {
      let mapLikesDislikes = {
        posts_ids_ordered: [],
        posts_likes_ordered: [],
        posts_dislikes_ordered: [],
      }

      var no_match = true;
      for(var i = 0 ; i < this.props.home_post_ids.length ; i++) {
        for(var j = 0 ; j < posts_likes_dislikes.Post_Ids.length; j++) {
          if(this.props.home_post_ids[i] == posts_likes_dislikes.Post_Ids[j]){
            mapLikesDislikes.posts_ids_ordered.push(posts_likes_dislikes.Post_Ids[j]);
            mapLikesDislikes.posts_likes_ordered.push(posts_likes_dislikes.Likes[j]);
            mapLikesDislikes.posts_dislikes_ordered.push(posts_likes_dislikes.Dislikes[j]);
            no_match = false
          }
        }
        if(no_match === true){
          mapLikesDislikes.posts_ids_ordered.push(this.props.home_post_ids[i]);
          mapLikesDislikes.posts_likes_ordered.push(0);
          mapLikesDislikes.posts_dislikes_ordered.push(0);
        }
        no_match = true
      }

      this.props.replaceHomePostsLikesDislikes(mapLikesDislikes.posts_likes_ordered, mapLikesDislikes.posts_dislikes_ordered)

      newState.homePostsLikes = mapLikesDislikes.posts_likes_ordered
      newState.homePostsDislikes = mapLikesDislikes.posts_dislikes_ordered

      this.setState({
        newState
      })
    }
  }

  onGetFollowingPosts = (data, profilePictures) => {
    if(data.Posts === null) {
      this.props.replaceHomePosts([],[],[],[],[],[])
    } else {
      axios.get('http://localhost:8000/plush-api/getLikesAndDislikes/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res3 => {
        if('Error' in res3.data) {
          console.log(res3.Data.Error)
        } else {
          let data = res3.data
          console.log("HEre please:");
          console.log(this.props.home_post_ids);
          this.onLikeOrDislike(data)
        }
      }).catch(err => {
        console.log(err);
      })

      axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + this.props.home_post_ids, {headers: {'Authorization': this.props.access_token}}).then(res4 => {
        if('Error' in res4.data) {
          console.log(res4.Data.Error)
        } else {
          let data = res4.data
          console.log("WE got her so far:");
          console.log(data);
          this.onLikeAndDislikeTotals(data);
        }
      }).catch(err => {
        console.log(err);
      })

      let postsWithImages = []
      for(var i = 0 ; i < data.Types_Of_Posts.length ; i++ ) {
        if(data.Types_Of_Posts[i] === 1) {
          postsWithImages.push(data.Posts[i]);
        }
      }

      if(postsWithImages.length === 0) {
          this.props.replaceHomePosts(data.Posts, data.Post_Times, profilePictures, data.Display_Names, data.Post_Ids, data.Types_Of_Posts)
          let newState = this.state
          newState.loading = false;
          this.setState({
            newState
          })
      } else {
        axios.get('http://localhost:8001/plush-file-server/getPostImages/' + postsWithImages, {headers: {'Authorization': this.props.access_token}}).then(res7 => {
          if(res7.data != null) {
            if('Error' in res7.data) {
              console.log(res7.data.Error);
            } else {
              for(var j = 0 ; j < data.Types_Of_Posts.length ; j++ ) {
                if(data.Types_Of_Posts[j] === 1) {
                  data.Posts[j] = res7.data.Data[j]
                }
              }
              this.props.replaceHomePosts(data.Posts, data.Post_Times, profilePictures, data.Display_Names, data.Post_Ids, data.Types_Of_Posts)
              let newState = this.state
              newState.loading = false;
              this.setState({
                newState
              })
            }
          }
        }).catch(err => {
          console.log(err);
        })
      }

    }

  }

  onLikeClick = (user_id, post_id) => {
    let ids = {
      user_id: user_id,
      post_id: post_id
    }
    axios.post('http://localhost:8000/plush-api/like', JSON.stringify(ids), {headers: {'Authorization': this.props.access_token}}).then(res5 => {
      if('Error' in res5.data) {
        console.log(res5.Data.Error);
      } else {
        this.onLikeOrDislike(res5.data)
        this.getLikesAndDislikesTotals(this.props.home_post_ids)
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
    axios.post('http://localhost:8000/plush-api/dislike', JSON.stringify(ids), {headers: {'Authorization': this.props.access_token}}).then(res6 => {
      if('Error' in res6.data) {
        console.log(res6.Data.Error);
      } else {
        this.onLikeOrDislike(res6.data)
        this.getLikesAndDislikesTotals(this.props.home_post_ids)
      }
    }).catch(err => {
      console.log("Error: " + err);
    })
  }

  getLikesAndDislikesTotals = (post_ids) => {
    axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + post_ids, {headers: {'Authorization': this.props.access_token}}).then(res7 => {
      if('Error' in res7.data) {
        console.log(res7.Data.Error)
      } else {
        let data = res7.data
        this.onLikeAndDislikeTotals(data);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  onLikeAndDislikeTotals = (totals) => {

    this.props.replaceHomePostsLikesAndDislikesTotals(totals.TotalLikes, totals.TotalDislikes)

    let newState = this.state
    newState.homePostsLikeTotals = totals.TotalLikes
    newState.homePostsDislikeTotals = totals.TotalDislikes

    this.setState({
      newState
    })
  }


  render() {
      let posts = this.props.home_posts
          if(posts !== null) {
            posts = this.props.home_posts.map((post, index) => (
              <Row style={{margin:"1% 0"}}key={uuid.v4()}>
                  <Col xs={12}>
                    <Row>
                    <Col xs={2}>
                    </Col>
                      <Col xs={8}>
                      <Card style={{borderRadius: "25px", marginLeft:"1%",fontFamily:"Risque"}}>
                        <CardHeader
                          title={<div style={{color: "#173777"}}>{this.props.home_display_names[index]}</div>}
                          subtitle={<TimeAgo date={this.props.home_post_times[index]} />}
                          avatar={this.props.home_profile_pictures[index] === "empty" ? require("../Images/DefaultAvatar.png") : this.props.home_profile_pictures[index]}
                        />
                        <CardText style={{marginLeft:"1%", wordWrap: 'break-word', color:"#FF5522"}}>
                          {post}
                        </CardText>
                        <CardActions>
                          <FlatButton label="Comment" style={{fontFamily:"Risque", color: "#173777"}}/>
                          <FlatButton
                            label="Like"
                            backgroundColor={this.props.home_posts_likes[index] === 1 ? "#FF5522" : "#FFFFFF"}
                            onClick={() => this.onLikeClick(this.props.user_id, this.props.home_post_ids[index])}
                            style={{fontFamily:"Risque", color: this.props.home_posts_likes[index] === 1 ? "#FFFFFF" : "#173777"}}
                            />
                          <FlatButton
                            label="Dislike"
                            backgroundColor={this.props.home_posts_dislikes[index] === 1 ? "#173777" : "#FFFFFF"}
                            onClick={() => this.onDislikeClick(this.props.user_id, this.props.home_post_ids[index])}
                            style={{fontFamily:"Risque", color: this.props.home_posts_dislikes[index] === 1 ? "#FFFFFF" : "#173777"}}
                            />
                            <Button style={{height: "100%", width: "35px", float: "right", color: "#173777", backgroundColor:"white"}} variant="fab"  aria-label="totalDislikes">
                              {this.props.home_posts_dislikes_totals[index]}
                            </Button>
                            <Button style={{height: "100%", width: "35px", float: "right", backgroundColor:"white"}} variant="fab" disabled aria-label="totalDislikesIcon">
                                <ThumbDown style={{color: "#173777"}}/>
                            </Button>
                            <Button style={{height: "100%", width: "35px", float: "right", color: "#FF5522", backgroundColor:"white"}} variant="fab" aria-label="totalLikes">
                              {this.props.home_posts_likes_totals[index]}
                            </Button>
                            <Button style={{height: "100%", width: "35px", float: "right", backgroundColor: "white"}} variant="fab" disabled aria-label="totalLikesIcon">
                                <ThumbUp style={{color: "#FF5522"}}/>
                            </Button>
                        </CardActions>
                      </Card>
                      </Col>
                      <Col xs={2}>
                      </Col>
                    </Row>
                  </Col>
              </Row>
          ));
          }
      const imageUrl = require(`../Images/loginBackground.png`)
      if(!{posts}.length) {
        return (
          <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
          {this.state.loading === true ?
            <Row center="xs" style={{marginTop: "3%"}}>
              <Col xs={12} style={{alignItems: "center"}}>
                <CircularProgress style={{color: "white"}} size={300} thickness={1}/>
                <h3 style={{position: "relative", fontSize: "30px", marginTop:"-170px", color: "#173777"}}>Loading...</h3>
              </Col>
            </Row>
          :
            <Row center="xs">
              <Col xs={8} style={{textAlign:"left"}}>
                <List>
                  {posts}
                </List>
              </Col>
            </Row>
          }
          </div>
        );
      } else {
        return (
          <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
          </div>
        )
      }
    }
  }

  function mapStateToProps(state) {
    return {
      access_token: state.user.access_token,
      user_id: state.user.user_id,
      home_posts: state.home.home_posts,
      home_post_times: state.home.home_post_times,
      home_post_ids: state.home.home_post_ids,
      home_profile_pictures: state.home.home_profile_pictures,
      home_display_names: state.home.home_display_names,
      home_posts_likes: state.home.home_posts_likes,
      home_posts_dislikes: state.home.home_posts_dislikes,
      home_posts_likes_totals: state.home.home_posts_likes_totals,
      home_posts_dislikes_totals: state.home.home_posts_dislikes_totals,
    }
  }

  function matchDispachToProps(dispatch) {
    return bindActionCreators({
      replaceHomePosts: replaceHomePosts,
      replacePageTitle: replacePageTitle,
      replaceHomePostsLikesDislikes: replaceHomePostsLikesDislikes,
      replaceHomePostsLikesAndDislikesTotals: replaceHomePostsLikesAndDislikesTotals,
    }, dispatch)
  }


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Home));
