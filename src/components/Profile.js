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
import {replaceFollowCount} from '../actions/replaceFollowCount';
import {replaceDisplayName} from '../actions/replaceDisplayName';
import {followersOrFollowings} from '../actions/followersOrFollowings';
import {replacePostsLikesDislikes} from '../actions/replacePostsLikesDislikes';
import {replacePostsLikesAndDislikesTotals} from '../actions/replacePostsLikesAndDislikesTotals';
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
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {replacePageTitle} from '../actions/replacePageTitle'
import CircularProgress from '@material-ui/core/CircularProgress';

class Profile extends React.Component {
  state = {
    loggedIn: false,
    onProfile: true,
    userViewId: '',
    redirect: false,
    followerPage: false,
    searchUsers: [],
    searchUsersIds: [],
    searchUsersAvatars: [],
    postsLikes: this.props.posts_likes,
    postsDislikes: this.props.posts_likes,
    postsLikeTotals: this.props.posts_likes_totals,
    postsDislikeTotals: this.props.posts_dislikes_totals,
    typesOfPosts: this.props.types_of_posts,
    loading: true,
    path: '',
    open: false,
    openDisplayEdit: false,
    displayName: this.props.display_name,
    editedName: ""
  }

  componentWillMount() {
    if(this.props.access_token != "") {
      let newState = this.state
      newState.loggedIn = true
      this.setState({
        newState
      })
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000/plush-api/getPosts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        let data = res.data
        console.log(data);
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

    axios.get('http://localhost:8000/plush-api/getFollowCounts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res3 => {
      if('Error' in res3.data) {
        console.log(res3.Data.Error)
      } else {
        let data = res3.data
        this.onGetFollowCount(data)
      }
    }).catch(err => {
      console.log(err);
    })

    axios.get('http://localhost:8000/plush-api/getDisplayName/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res4 => {
      if('Error' in res4.data) {
        console.log(res4.Data.Error)
      } else {
        let data = res4.data
        this.onGetDisplayName(data)
      }
    }).catch(err => {
      console.log(err);
    })

    this.props.replacePageTitle("PROFILE")
  }

  onGetDisplayName(data) {
    console.log(data);
    this.props.replaceDisplayName(data.Display_Name)
  }

  onGetPosts = (data) => {
    if(data.Posts === null) {
      this.props.replacePosts([],[],[],[])
    } else {
      this.props.replacePosts(data.Posts, data.Post_Times, data.Post_Ids, data.Types_Of_Posts)

      axios.get('http://localhost:8000/plush-api/getLikesAndDislikes/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res5 => {
        if('Error' in res5.data) {
          console.log(res5.Data.Error)
        } else {
          let data = res5.data
          console.log("Sucess so far !");
          this.onLikeOrDislike(data)
        }
      }).catch(err => {
        console.log(err);
      })

      axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + this.props.post_ids, {headers: {'Authorization': this.props.access_token}}).then(res6 => {
        if('Error' in res6.data) {
          console.log(res6.Data.Error)
        } else {
          let data = res6.data
          this.onLikeAndDislikeTotals(data);
        }
      }).catch(err => {
        console.log(err);
      })

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
    this.props.addPost(post.Post, post.Post_Time, post.Post_Id, post.Type_Of_Post);
  }

  onDeletePost = (index) => {
    this.props.deletePost(index);
  }

  onGetUser = (user) => {
    if(user.User_Id === "") {
      console.log("user does not exist");
    } else {
      this.props.setUserView(user.Display_Name, user.User_Id);
      let newState = this.state
      newState.searchUsers = []
      newState.searchUsersIds = []
      newState.searchUsersAvatars = []
      newState.redirect = true
      newState.userViewId = user.User_Id
      this.setState({
        newState
      });
    }
  }

  onAddProfilePicture = (blob) => {
    this.props.addProfilePicture(blob.Data);
  }

  onAddPostImage = (data, meta) => {
    console.log("meow" + meta.Type_Of_Post);
    this.props.addPost(data, meta.Post_Time, meta.Post_Id, meta.Type_Of_Post);
  }

  onSearchUsers = (users) => {
      let newState = this.state
      newState.searchUsers = users.Display_Names
      newState.searchUsersIds = users.User_Ids
      newState.searchUsersAvatars = users.Avatars
      this.setState({
        newState
      });
  }

  onGetFollowCount = (counts) => {
    this.props.replaceFollowCount(counts.FollowerCount, counts.FollowingCount);
  }

  handleProfileClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    let newState = this.state
    newState.open = true
    newState.anchorEl = event.currentTarget
    this.setState({
      newState
    });
  };

  handleProfileRequestClose = () => {
    let newState = this.state
    newState.open = false
    this.setState({
      newState
    });
  };

  handleChipClick = (value) => {
    this.props.followersOrFollowings(value);
    this.props.replacePageTitle("MY COMMUNITY")
    let newState = this.state
    newState.followerPage = true
    this.setState({
      newState
    })
  }

  handleClickOpen = () => {
    let newState = this.state
    newState.openDisplayEdit = true
    this.setState({
      newState
    });
  };

  handleClickClose = () => {
    let newState = this.state
    newState.openDisplayEdit = false
    this.setState({
      newState
    });
  };

  handleClickSave = () => {
    let newState = this.state
    newState.openDisplayEdit = false
    newState.displayName = newState.editedName
    let edit_display_name = {
      user_id: this.props.user_id,
      display_name: newState.displayName
    }

    axios.post('http://localhost:8000/plush-api/editDisplayName', JSON.stringify(edit_display_name), {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        newState.displayName = res.data.Display_Name
        this.setState({
          newState
        });
        this.props.replaceDisplayName(newState.displayName)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
    })
  }

  onEditName = (evt) => {
    let newState = this.state
    newState.editedName = evt.target.value
    this.setState({
      newState
    })
  }

  onLikeOrDislike = (posts_likes_dislikes) => {
    let newState = this.state
    if(posts_likes_dislikes.Likes === null && posts_likes_dislikes.Dislikes === null) {
      this.props.replacePostsLikesDislikes([], [])
      newState.postsLikes = []
      newState.postsDislikes = []

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
      for(var i = 0 ; i < this.props.post_ids.length ; i++) {
        for(var j = 0 ; j < posts_likes_dislikes.Post_Ids.length; j++) {
          if(this.props.post_ids[i] == posts_likes_dislikes.Post_Ids[j]){
            mapLikesDislikes.posts_ids_ordered.push(posts_likes_dislikes.Post_Ids[j]);
            mapLikesDislikes.posts_likes_ordered.push(posts_likes_dislikes.Likes[j]);
            mapLikesDislikes.posts_dislikes_ordered.push(posts_likes_dislikes.Dislikes[j]);
            no_match = false
          }
        }
        if(no_match === true){
          mapLikesDislikes.posts_ids_ordered.push(this.props.post_ids[i]);
          mapLikesDislikes.posts_likes_ordered.push(0);
          mapLikesDislikes.posts_dislikes_ordered.push(0);
        }
        no_match = true
      }
      this.props.replacePostsLikesDislikes(mapLikesDislikes.posts_likes_ordered, mapLikesDislikes.posts_dislikes_ordered)
      newState.postsLikes = mapLikesDislikes.posts_likes_ordered
      newState.postsDislikes = mapLikesDislikes.posts_dislikes_ordered

      this.setState({
        newState
      })
    }
    }

  onLikeAndDislikeTotals = (totals) => {

    this.props.replacePostsLikesAndDislikesTotals(totals.TotalLikes, totals.TotalDislikes)
    console.log(totals.TotalLikes, totals.TotalDislikes);
    let newState = this.state
    newState.postsLikeTotals = totals.TotalLikes
    newState.postsDislikeTotals = totals.TotalDislikes
    newState.loading = false

    this.setState({
      newState
    })
  }


  render() {

    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }

    if (this.state.redirect === true) {
      this.props.replacePageTitle("USER")
      return <Redirect push to={`/view/${this.state.userViewId}`}/>;
    }

    if(this.state.followerPage === true) {
      return <Redirect push to={'/my_community'}/>;
    }

    const imageUrl = require(`../Images/loginBackground.png`)
    let openDisplayEdit = this.state.openDisplayEdit
    if(this.state.displayName === "") {
      openDisplayEdit = true
    } else {
      openDisplayEdit = false
    }
    if(this.state.displayName !== "" && this.state.openDisplayEdit) {
      openDisplayEdit = true
    }
    return (
      <div id="backgroundDiv" style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
      {this.state.loading === true ?
        <Row center="xs" style={{marginTop: "3%"}}>
          <Col xs={12} style={{alignItems: "center"}}>
            <CircularProgress style={{color: "white"}} size={300} thickness={1}/>
            <h3 style={{position: "relative", fontSize: "30px", marginTop:"-170px", color: "#173777"}}>Loading...</h3>
          </Col>
        </Row>
      :
      <Grid >
        <Row center="xs">
          <Col xs={4} style={{alignItems: "center"}}>
            <Row center="xs">
              <h1
                style={{fontFamily:"Risque", marginTop:"10px", color:"white", cursor:"pointer"}}
                onClick={this.handleClickOpen}
                >
                {this.state.displayName === "" ? "No Name": this.state.displayName}
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
        <Row center="xs" style={{marginTop:"20px"}}>
          <Col xs={8} style={{alignItems: "center"}}>
              <Chip
                avatar={<Avatar style={{backgroundColor:"white", color:"#FF5522"}}>{this.props.followers_count}</Avatar>}
                label="Following"
                onClick={() => this.handleChipClick(0)}
                style={{margin:"0px 1%",fontFamily:"Risque", color:"#FF5522"}}

              />
              <Chip
                avatar={<Avatar style={{backgroundColor:"white", color:"#FF5522"}}>{this.props.following_count}</Avatar>}
                label="Followers"
                onClick={() => this.handleChipClick(1)}
                style={{fontFamily:"Risque", color:"#FF5522"}}
              />

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
                  user_id={this.props.user_id}
                  onAddPost={this.onAddPost}
                  post_ids={this.props.post_ids}
                  access_token={this.props.access_token}
                  onLikeOrDislike={this.onLikeOrDislike}
                  onLikeAndDislikeTotals={this.onLikeAndDislikeTotals}
                  onAddPostImage={this.onAddPostImage}
                />
              </Paper>
            </Row>
            <Row start="xs">
              <Paper style={{height: "100%", width: "100%", borderRadius: "25px", margin: "10px 0px"}} zDepth={3}>
                <PostView
                  posts={this.props.posts}
                  post_ids={this.props.post_ids}
                  post_times={this.props.post_times}
                  display_name={this.props.display_name}
                  user_id={this.props.user_id}
                  onDeletePost={this.onDeletePost}
                  access_token={this.props.access_token}
                  profile_picture={this.props.profile_picture}
                  onLikeOrDislike={this.onLikeOrDislike}
                  onLikeAndDislikeTotals={this.onLikeAndDislikeTotals}
                  postsLikes={this.state.postsLikes}
                  postsDislikes={this.state.postsDislikes}
                  postsLikeTotals={this.state.postsLikeTotals}
                  postsDislikeTotals={this.state.postsDislikeTotals}
                  typesOfPosts={this.props.types_of_posts}
                />
              </Paper>
            </Row>
          </Col>
        </Row>
      </Grid>
    }
      <Dialog
          open={openDisplayEdit}
          onClose={this.handleClickClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <div style={{fontFamily: "Risque", color: "#FF5522"}}>
              Edit Display Name
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{fontFamily: "Risque"}}>
              Enter your display name here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              onChange={this.onEditName}
              label={<div style={{fontFamily: "Risque"}}>Display Name</div>}
              value={this.state.editedName}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button style={{fontFamily: "Risque"}} onClick={this.handleClickClose} color="primary">
              Cancel
            </Button>
            <Button style={{fontFamily: "Risque"}} onClick={this.handleClickSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
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
    types_of_posts: state.user.types_of_posts,
    user_id: state.user.user_id,
    profile_picture: state.user.profile_picture,
    followers_count: state.user.followers_count,
    following_count: state.user.following_count,
    posts_likes: state.user.posts_likes,
    posts_dislikes: state.user.posts_dislikes,
    posts_likes_totals: state.user.posts_likes_totals,
    posts_dislikes_totals: state.user.posts_dislikes_totals,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    addProfilePicture: addProfilePicture,
    replacePosts: replacePosts,
    setUserView: setUserView,
    deletePost: deletePost,
    replaceFollowCount: replaceFollowCount,
    followersOrFollowings: followersOrFollowings,
    replacePageTitle: replacePageTitle,
    replaceDisplayName: replaceDisplayName,
    replacePostsLikesDislikes: replacePostsLikesDislikes,
    replacePostsLikesAndDislikesTotals: replacePostsLikesAndDislikesTotals,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Profile));
