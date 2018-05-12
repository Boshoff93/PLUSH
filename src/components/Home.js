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

export class Home extends React.Component {

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
}

  onGetFollowingPosts = (data, profilePictures) => {
    if(data.Posts === null) {
      this.props.replaceHomePosts([],[],[],[])
    } else {
      this.props.replaceHomePosts(data.Posts, data.Post_Times, profilePictures, data.Display_Names)
    }
  }

  render() {
      let posts = this.props.home_posts
      if(posts !== null) {
        posts = this.props.home_posts.map((post, index) => (
          <Row style={{margin:"1% 0"}}key={uuid.v4()}>
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                  <Card style={{borderRadius: "25px", marginLeft:"1%"}}>
                    <CardHeader
                      title={this.props.home_display_names[index]}
                      subtitle={this.props.home_post_times[index]}
                      avatar={this.props.home_profile_pictures[index] === "empty" ? require("../Images/DefaultAvatar.png") : this.props.home_profile_pictures[index]}
                    />
                    <CardText style={{marginLeft:"1%", wordWrap: 'break-word'}}>
                      {post}
                    </CardText>
                    <CardActions>
                      <FlatButton label="Comment" />
                      <FlatButton label="Like" />
                      <FlatButton label="Dislike" />
                    </CardActions>
                  </Card>
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
            <List>
              {posts}
            </List>
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
      home_profile_pictures: state.home.home_profile_pictures,
      home_display_names: state.home.home_display_names,
    }
  }

  function matchDispachToProps(dispatch) {
    return bindActionCreators({
      replaceHomePosts: replaceHomePosts,
    }, dispatch)
  }


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Home));
