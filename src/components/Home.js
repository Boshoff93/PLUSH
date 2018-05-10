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
    axios.get('http://localhost:8000/plush-api/getAllFollowPosts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        console.log("got it");
        let data = res.data
        this.onGetFollowingPosts(data)
      }
    }).catch(err => {
      console.log(err);
    })
  }

  onGetFollowingPosts = (data) => {
    if(data.Posts === null) {
      this.props.replaceHomePosts([],[],[],[])
    } else {
      this.props.replaceHomePosts(data.Posts, data.Post_Times, [], data.Display_Names)
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
                      //avatar={this.props.home_profile_pictures[index]}
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
