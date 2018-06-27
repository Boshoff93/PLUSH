import React from 'react';
import ImageUpload from './ImageUpload'
import {bindActionCreators} from 'redux'
import {replaceFollowCount} from '../actions/replaceFollowCount';
import {connect} from 'react-redux';
import '../App.css';
import {Redirect} from 'react-router-dom'
import { withRouter } from 'react-router'
import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import {List} from 'material-ui/List';
import uuid from 'uuid';
import {replacePageTitle} from '../actions/replacePageTitle'
import CircularProgress from '@material-ui/core/CircularProgress';


class Community extends React.Component {
  state = {
    loggedIn: false,
    onProfile: true,
    userViewId: '',
    redirect: false,
    followerPage: false,
    followingDisplayNames: [],
    followingIds: [],
    followingAvatars: [],
    followerDisplayNames: [],
    followerIds: [],
    followerAvatars: [],
    path: '',
    open: false,
    loading: true,
    value: this.props.followers_or_followings,
  }

    handleChange = (event, value) => {
      this.setState({ value });
    };

    handleChangeIndex = (index) => {
    this.setState({ value: index });
  };

  componentWillMount() {
    if(this.props.access_token != "") {
      this.setState({
        loggedIn: true
      })
    }
  }

  componentDidMount(){
    axios.get('http://localhost:8000/plush-api/getFollowersAndFollowings/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res1 => {
      if('Error' in res1.data) {
        console.log(res1.Data.Error)
      } else {
        let data = res1.data
        console.log(data);
        this.onGetFollowCount(data.FollowerCount, data.FollowingCount)

        axios.get('http://localhost:8001/plush-file-server/searchedUserProfilePictures/' + data.Following_Pp_Names, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
          if(res2.data != null) {
            if('Error' in res2.data) {
              console.log(res2.data.Error);
            } else {
              console.log(res2.data.Data);
              var followingsFound = {
                Display_Names: data.Following_Display_Names,
                Following_Ids: data.Following_Ids,
                Avatars: res2.data.Data,
              }
              this.onFollowingsFound(followingsFound)
            }
          }
        }).catch(err => {
          console.log(err);
        })

        axios.get('http://localhost:8001/plush-file-server/searchedUserProfilePictures/' + data.Follower_Pp_Names, {headers: {'Authorization': this.props.access_token}}).then(res3 => {
          if(res3.data != null) {
            if('Error' in res3.data) {
              console.log(res3.data.Error);
            } else {
              console.log(res3.data.Data);
              var followersFound = {
                Display_Names: data.Follower_Display_Names,
                Follower_Ids: data.Follower_Ids,
                Avatars: res3.data.Data,
              }
              this.onFollowersFound(followersFound)
            }
          }
        }).catch(err => {
          console.log(err);
        })

      }
    }).catch(err => {
      console.log(err);
    })
    this.props.replacePageTitle("MY COMMUNITY")
  }

  onFollowingsFound = (followings) => {
      let newState = this.state
      newState.followingDisplayNames = followings.Display_Names
      newState.followingIds = followings.Following_Ids
      newState.followingAvatars = followings.Avatars
      newState.loading = false
      this.setState({
        newState
      });
  }

  onFollowersFound = (followers) => {
    let newState = this.state
    newState.followerDisplayNames = followers.Display_Names
    newState.followerIds = followers.Follower_Ids
    newState.followerAvatars = followers.Avatars
    this.setState({
      newState
    });
  }

  onGetFollowCount = (followerCount, followingCount) => {
    this.props.replaceFollowCount(followingCount, followerCount);
  }

  handleProfileClick = (type,index) => {
    var curState = this.state
    if(type === "following") {
      curState.userViewId = this.state.followingIds[index]
    } else {
      curState.userViewId = this.state.followerIds[index]
    }
    console.log(this.props.page_title);
    this.props.replacePageTitle("USER")
    console.log(this.props.page_title);
    curState.redirect = true;
    this.setState({
      curState
    })
  };

  render() {

    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }

    if (this.state.redirect === true) {
      return <Redirect push to={`/view/${this.state.userViewId}`}/>;
    }

    const imageUrl = require(`../Images/loginBackground.png`)
    const { value } = this.state.value;

    let followings = this.state.followingDisplayNames
    if(followings !== null) {
      followings = this.state.followingDisplayNames.map((user, index) => (
        <Row style={{margin:"1% 0"}}key={uuid.v4()}>
          <Col xs={12}>
            <Row center="xs">
              <h2 style={{fontFamily:"Risque", marginTop:"10px", color:"#173777"}}>
              {this.state.followingDisplayNames[index]}
              </h2>
            </Row>
            <Row center="xs">
              <Paper
              style={{width: "200px", height:"200px", cursor:"pointer"}}
              circle={true}
              zDepth={5}
              onClick={()=> this.handleProfileClick("following",index)}
              >
                <Avatar src={this.state.followingAvatars[index] === "empty" ? require("../Images/DefaultAvatar.png") :
                this.state.followingAvatars[index]} style={{width: "95%", height:"95%", marginTop: "2.5%"}} />
              </Paper>
            </Row>
          </Col>
        </Row>
      ));
    }

    let followers = this.state.followerDisplayNames
    if(followers !== null) {
      followers = this.state.followerDisplayNames.map((user, index) => (
        <Row style={{margin:"1% 0"}}key={uuid.v4()}>
          <Col xs={12}>
            <Row center="xs">
              <h2 style={{fontFamily:"Risque", marginTop:"10px", color:"#173777"}}>
              {this.state.followerDisplayNames[index]}
              </h2>
            </Row>
            <Row center="xs">
              <Paper
                style={{width: "200px", height:"200px", cursor:"pointer"}}
                circle={true}
                zDepth={5}
                onClick={() => this.handleProfileClick("follower",index)}
                >
                <Avatar src={this.state.followerAvatars[index] === "empty" ? require("../Images/DefaultAvatar.png") :
                this.state.followerAvatars[index]} style={{width: "95%", height:"95%", marginTop: "2.5%"}} />
              </Paper>
            </Row>
          </Col>
        </Row>

      ));
    }

    return (
      <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "visible"}}>
        {this.state.loading === true ?
          <Row center="xs" style={{paddingTop: "5%"}}>
            <Col xs={12} style={{alignItems: "center"}}>
              <CircularProgress style={{color: "white"}} size={300} thickness={1}/>
              <h3 style={{position: "relative", fontSize: "30px", marginTop:"-170px", color: "#173777"}}>Loading...</h3>
            </Col>
          </Row>
        :
        <Grid >
          <Row center="xs" style={{paddingTop:"8%"}}>
            <Col xs={4}>
              <AppBar position="static" color="default" style={{marginTop:"5%",borderRadius: "10px", color:"#173777"}}>
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  fullWidth
                  indicatorColor='primary'
                  style={{margin:"10px 4%"}}
                >
                  <Tab icon={<Avatar style={{backgroundColor:"#FF5522", color:"white"}}>{this.props.following_count}</Avatar>} label="Following" style={{fontFamily:"Risque"}} />
                  <Tab icon={<Avatar style={{backgroundColor:"#FF5522", color:"white"}}>{this.props.followers_count}</Avatar>} label="Followers" style={{fontFamily:"Risque"}} />
                </Tabs>
              </AppBar>
            </Col>
          </Row>
          <List>
            {this.state.value === 0 ? followings : followers}
          </List>
        </Grid>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    access_token: state.user.access_token,
    display_name: state.user.display_name,
    profile_picture: state.user.profile_picture,
    user_id: state.user.user_id,
    followers_count: state.user.followers_count,
    following_count: state.user.following_count,
    followers_or_followings: state.user.followers_or_followings,
    page_title: state.user.page_title,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    replaceFollowCount: replaceFollowCount,
    replacePageTitle: replacePageTitle,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Community));
