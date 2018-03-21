import React from 'react';
import PostView from './PostView';
import PostInput from './PostInput';
import SearchUser from './SearchUser';
import ImageUpload from './ImageUpload'
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {replacePosts} from '../actions/replacePosts';
import {setUserView} from '../actions/setUserView';
import {addProfilePicture} from "../actions/addProfilePicture";
import {deletePost} from '../actions/deletePost';
import {connect} from 'react-redux';
import '../App.css';
import {Redirect} from 'react-router-dom'
import { withRouter } from 'react-router'
import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';

class Profile extends React.Component {
  state = {
    loggedIn: false,
    onProfile: true,
    userViewId: '',
    redirect: false,
    searchUsers: [],
    searchUsersIds: [],
    searchUsersAvatars: [],
    path: '',
    open: false,
  }

  componentWillMount() {
    if(this.props.access_token != "") {
      this.setState({
        loggedIn: true
      })
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000/plush-api/getposts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {

      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        let data = res.data
        this.onGetPosts(data)
      }
    }).catch(err => {
      console.log(err);
    })

    axios.get('http://localhost:8000/plush-api/profilePicture/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res1 => {
      if('Error' in res1.data) {
        console.log(res1.Data.Error)
      } else {
        axios.get('http://localhost:8001/plush-file-server/profilePicture/' + res1.data.Pp_Name, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
          if('Error' in res2.data) {
            console.log(res2.Data.Error)
          } else {
            this.onGetProfilePicture(res2.data)
          }
        }).catch(err => {
          console.log(err);
        })
      }
    }).catch(err => {
      console.log(err);
      this.onGetProfilePicture("")
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  }

  onGetPosts = (data) => {
    if(data.Posts === null) {
      this.props.replacePosts([],[],[])
    } else {
      this.props.replacePosts(data.Posts, data.Post_Times, data.Post_Ids)
    }
  }

  onGetProfilePicture = (data) => {
    if(data !== ""){
      this.props.addProfilePicture("data:image/jpeg;base64," + data.Data);
    } else {
      this.props.addProfilePicture(require("../Images/DefaultAvatar.png"));
    }
  }

  onAddPost = (post) => {
    this.props.addPost(post.Post, post.Post_Time, post.Post_Id);
  }

  onDeletePost = (index) => {
    this.props.deletePost(index);
  }

  onGetUser = (user) => {
    if(user.User_Id === "") {
      console.log("user does not exist");
    } else {
      this.props.setUserView(user.Display_Name, user.User_Id);
      this.setState({
        searchUsers: [],
        searchUsersIds: [],
        searchUsersAvatars: [],
        redirect: true,
        userViewId: user.User_Id
      });
    }
  }

  onAddProfilePicture = (blob) => {
    this.props.addProfilePicture(blob.Data);
  }

  onSearchUsers = (users) => {
      this.setState({
        searchUsers: users.Display_Names,
        searchUsersIds: users.User_Ids,
        searchUsersAvatars: users.Avatars,
      });
  }

  handleProfileClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleProfileRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }

    if (this.state.redirect === true) {
      return <Redirect push to={`/view/${this.state.userViewId}`}/>;
    }
    const imageUrl = require(`../Images/loginBackground.png`)
    return (
      <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
      <Grid >
        <Row center="xs">
          <Col xs={4} style={{alignItems: "center"}}>
            <Row center="xs">
              <h1 style={{fontFamily:"Risque", marginTop:"10px", color:"white"}}>
                {this.props.display_name}
              </h1>
            </Row>
            <Row center="xs">
              <Paper
                style={{width: "250px", height:"250px", cursor:"pointer",marginTop:"10px"}}
                circle={true}
                zDepth={5}
                onClick={this.handleProfileClick}>
                <Avatar src={this.props.profile_picture} style={{width: "95%", height:"95%", marginTop: "2.5%"}} />
              </Paper>
              <Popover
                style={{marginLeft: "1%", borderRadius: "25px"}}
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'center'}}
                targetOrigin={{horizontal: 'left', vertical: 'center'}}
                onRequestClose={this.handleProfileRequestClose}
                autoCloseWhenOffScreen={true}
                >
              <Menu>
                <ImageUpload
                user_id={this.props.user_id}
                onAddProfilePicture={this.onAddProfilePicture}
                access_token={this.props.access_token}
                />
              </Menu>
              </Popover>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <SearchUser
              onProfile={this.state.onProfile}
              user_id={this.props.user_id}
              onSearchUsers={this.onSearchUsers}
              onGetUser={this.onGetUser}
              searchUsers={this.state.searchUsers}
              searchUsersIds={this.state.searchUsersIds}
              searchUsersAvatars={this.state.searchUsersAvatars}
              access_token={this.props.access_token}
            />
          </Col>
          <Col xs={9}>
            <Row>
              <Paper style={{height: "100%", width: "100%", borderRadius: "25px", marginTop: "25px"}} zDepth={3}>
                <PostInput
                  socket={this.socket}
                  user_id={this.props.user_id}
                  onAddPost={this.onAddPost}
                  access_token={this.props.access_token}
                />
              </Paper>
            </Row>
            <Row start="xs">
              <Paper style={{height: "100%", width: "100%", borderRadius: "25px", margin: "10px 0px"}} zDepth={3}>
                <PostView
                  socket={this.socket}
                  posts={this.props.posts}
                  post_ids={this.props.post_ids}
                  post_times={this.props.post_times}
                  display_name={this.props.display_name}
                  user_id={this.props.user_id}
                  onDeletePost={this.onDeletePost}
                  access_token={this.props.access_token}
                  profile_picture={this.props.profile_picture}
                />
              </Paper>
            </Row>
          </Col>
        </Row>
      </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    access_token: state.user.access_token,
    display_name: state.user.display_name,
    posts: state.user.posts,
    post_times: state.user.post_times,
    post_ids: state.user.post_ids,
    user_id: state.user.user_id,
    profile_picture: state.user.profile_picture,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    addProfilePicture: addProfilePicture,
    replacePosts: replacePosts,
    setUserView: setUserView,
    deletePost: deletePost,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Profile));
