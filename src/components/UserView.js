import React from 'react';
import PostInput from './PostInput';
import ImageUpload from './ImageUpload'
import UserPostView from './UserPostView'
import SearchUser from './SearchUser';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {setUserView} from '../actions/setUserView';
import {replaceUserViewPosts} from '../actions/replaceUserViewPosts';
import {addUserViewPP} from '../actions/addUserViewPP';
import {connect} from 'react-redux';
import '../App.css';
import {Redirect,withRouter} from 'react-router-dom'
import axios from 'axios';
import Avatar from 'material-ui/Avatar';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {replacePageTitle} from '../actions/replacePageTitle'
import {replaceUserViewPostsLikesDislikes} from '../actions/replaceUserViewPostsLikesDislikes'
import {replaceUserViewPostsLikesAndDislikesTotals} from '../actions/replaceUserViewPostsLikesAndDislikesTotals'

class UserView extends React.Component {
  state = {
    loggedIn: false,
    onProfile: false,
    redirect: false,
    preventHistoryPush: 0,
    searchUsers: [],
    searchUsersIds: [],
    searchUsersAvatars: [],
    open: false,
    following: false,

    userViewPostsLikes: [],
    userViewPostsDislikes: [],

    userViewPostsLikeTotals: [],
    userViewPostsDislikeTotals: [],

  }

  componentWillMount() {
    if(this.props.access_token != "") {
      this.setState({
        loggedIn: true
      })
    }
  }


  componentDidMount() {
    if(this.state.loggedIn != false) {
      this.getUser()
      this.checkFollowing()
      this.setState({
        preventHistoryPush: 1
      })

      const unlisten = this.unlisten = this.props.history.listen((location, action) => {
        let newState = this.state
        newState.preventHistoryPush = 1
        this.setState({
          newState
        })
        this.getUser()
        this.checkFollowing()
      });
    }

    this.props.replacePageTitle("USER")
  }

  getUser = () => {
    axios.get('http://localhost:8000/plush-api/userViewId/' + this.props.match.params.id,  {headers: {'Authorization': this.props.access_token}}).then(res3 => {
      if('Error' in res3.data) {
        console.log(res3.Data.Error);
      } else {
        this.onGetUser(res3.data)
      }
    }).catch(err => {
      console.log(err);
    })
  }

  checkFollowing = () => {
    let id_fields = [this.props.user_id, this.props.match.params.id];
    axios.get('http://localhost:8000/plush-api/checkFollowing/' + id_fields,  {headers: {'Authorization': this.props.access_token}}).then(res4 => {
      if('Error' in res4.data) {
        console.log(res4.data.Error);
      } else {
        this.setState({
          following: res4.data.Condition
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }

  componentWillUnmount() {
    if(this.state.loggedIn != false) {
      const unlisten = this.unlisten
      unlisten()
    }
  }

  onGetPosts(posts) {
    if(posts.Posts === null) {
      this.props.replaceUserViewPosts([], [], [])
    } else {
      this.props.replaceUserViewPosts(posts.Posts, posts.Post_Times, posts.Post_Ids)
    }
  }

  onError(error){
    //do nothing
  }

  onGetUser = (user) => {
   if(user.User_Id !== "") {
      this.props.setUserView(user.Display_Name, user.User_Id);

      axios.get('http://localhost:8000/plush-api/getPosts/' + user.User_Id,  {headers: {'Authorization': this.props.access_token}}).then(res5 => {
        if('Error' in res5.data) {
          console.log(res5.Data.Error);
        } else {
          let data = res5.data
          this.onGetPosts(data)
        }
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })

      axios.get('http://localhost:8000/plush-api/profilePicture/' + user.User_Id,  {headers: {'Authorization': this.props.access_token}}).then(res6 => {
        if('Error' in res6.data) {
          console.log(res6.Data.Error);
        } else {
          axios.get('http://localhost:8001/plush-file-server/profilePicture/' + res6.data.Pp_Name, {headers: {'Authorization': this.props.access_token}}).then(res7 => {
            if('Error' in res7.data) {
              console.log(res7.Data.Error);
            } else {
              this.onGetProfilePicture(res7.data)
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

      axios.get('http://localhost:8000/plush-api/getLikesAndDislikes/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res1 => {
        if('Error' in res1.data) {
          console.log(res1.Data.Error)
        } else {
          let data = res1.data
          this.onLikeOrDislike(data)
        }
      }).catch(err => {
        console.log(err);
      })

      axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + this.props.userView.user_view_post_ids, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
        if('Error' in res2.data) {
          console.log(res2.Data.Error)
        } else {
          let data = res2.data
          this.onLikeAndDislikeTotals(data);
        }
      }).catch(err => {
        console.log(err);
      })

      let newState = this.state
      newState.userViewId = user.User_Id
      newState.searchUsers = []
      newState.searchUsersIds = []
      newState.searchUsersAvatars = []
      newState.redirect = true
      if(newState.preventHistoryPush === 0) {
        this.props.history.push(`/view/${user.User_Id}`)
      }
      newState.preventHistoryPush = 0
      this.setState({
        newState
      });
    }
  }

  onGetProfilePicture = (blob) => {
    if(blob !== "") {
      this.props.addUserViewPP("data:image/jpeg;base64," +blob.Data);
    } else {
      this.props.addUserViewPP(require("../Images/DefaultAvatar.png"));
    }
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

  addFollow = () => {
    if(this.state.following === false) {
      var id_fields = {
        user_id: this.props.user_id,
        follow_id: this.props.userView.user_view_id,
      }
      axios.post('http://localhost:8000/plush-api/follow', JSON.stringify(id_fields),  {headers: {'Authorization': this.props.access_token}}).then(res => {
        if('Error' in res.data) {
          console.log(res.Data.Error);
        } else {
          this.setState({
            following: true,
            open: false
          })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  unFollow = () => {
    if(this.state.following === true) {
      var id_fields = {
        user_id: this.props.user_id,
        follow_id: this.props.userView.user_view_id,
      }
      axios.delete('http://localhost:8000/plush-api/follow', {data: JSON.stringify(id_fields), headers: {'Authorization': this.props.access_token}}).then(res => {
        if('Error' in res.data) {
          console.log(res.Data.Error);
        } else {
          this.setState({
            following: false,
            open: false
          })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  onLikeOrDislike = (posts_likes_dislikes) => {
    let mapLikesDislikes = {
      posts_ids_ordered: [],
      posts_likes_ordered: [],
      posts_dislikes_ordered: [],
    }

    console.log(this.props.userView.user_view_post_ids.length)
    console.log(mapLikesDislikes);;

    for(var i = 0 ; i < this.props.userView.user_view_post_ids.length ; i++) {
      for(var j = 0 ; j < posts_likes_dislikes.Post_Ids.length; j++) {
        if(this.props.userView.user_view_post_ids[i] == posts_likes_dislikes.Post_Ids[j]){
          mapLikesDislikes.posts_ids_ordered.push(posts_likes_dislikes.Post_Ids[j]);
          mapLikesDislikes.posts_likes_ordered.push(posts_likes_dislikes.Likes[j]);
          mapLikesDislikes.posts_dislikes_ordered.push(posts_likes_dislikes.Dislikes[j]);
        }
      }
    }

    console.log("here2")
    console.log(mapLikesDislikes);;

    this.props.replaceUserViewPostsLikesDislikes(mapLikesDislikes.posts_likes_ordered, mapLikesDislikes.posts_dislikes_ordered)

    let newState = this.state
    newState.userViewPostsLikes = mapLikesDislikes.posts_likes_ordered
    newState.userViewPostsDislikes = mapLikesDislikes.posts_dislikes_ordered

    this.setState({
      newState
    })
  }

  onLikeAndDislikeTotals = (totals) => {

    console.log("This is this part");
    console.log(totals);
    if(totals.TotalLikes === null) {
      this.props.replaceUserViewPostsLikesAndDislikesTotals([], [])
    } else {
      this.props.replaceUserViewPostsLikesAndDislikesTotals(totals.TotalLikes, totals.TotalDislikes)
    }

    let newState = this.state
    newState.userViewPostsLikeTotals = totals.TotalLikes
    newState.userViewPostsDislikeTotals = totals.TotalDislikes

    this.setState({
      newState
    })
  }

  render() {
    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }
    const imageUrl = require(`../Images/loginBackground.png`)
    //put logic here to figure out if already folowwing or not.
    return (
      <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
      <Grid >
        <Row center="xs">
          <Col xs={4} style={{alignItems: "center"}}>
            <Row center="xs">
              <h1 style={{fontFamily:"Risque", marginTop:"10px", color:"white"}}>
                {this.props.userView.user_view_display_name}
              </h1>
            </Row>
            <Row center="xs">
                <Paper
                  style={{width: "250px", height:"250px", cursor:"pointer", marginTop:"10px"}}
                  circle={true}
                  zDepth={5}
                  onClick={this.handleProfileClick}>
                  <Avatar src={this.props.userView.user_view_profile_picture} style={{width: "95%", height:"95%", marginTop: "2.5%"}} />
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
                    {this.state.following ?
                      <MenuItem
                        primaryText="Following"
                        style={{textAlign: "center", backgroundColor:"#173777", color:"#FFFFFF",fontFamily:"Risque", borderRadius: "25px", margin: "0px 10px"}}
                        containerElement='label'
                        onClick={this.unFollow}
                      >
                      </MenuItem>
                    :
                      <MenuItem
                        primaryText="Follow"
                        style={{textAlign: "center", borderRadius: "25px",fontFamily:"Risque", margin: "0px 10px"}}
                        containerElement='label'
                        onClick={this.addFollow}
                      >
                      </MenuItem>}
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
            <Row start="xs">
              <Paper style={{height: "100%", width: "100%", borderRadius: "25px", margin: "25px 0px"}} zDepth={3}>
                <UserPostView
                  posts={this.props.userView.user_view_posts}
                  post_times={this.props.userView.user_view_post_times}
                  display_name={this.props.userView.user_view_display_name}
                  profile_picture={this.props.userView.user_view_profile_picture}
                  user_id={this.props.user_id}
                  post_ids={this.props.userView.user_view_post_ids}
                  access_token={this.props.access_token}
                  postsLikes={this.props.userView.user_view_posts_likes}
                  postsDislikes={this.props.userView.user_view_posts_dislikes}
                  postsLikeTotals={this.props.userView.user_view_posts_likes_totals}
                  postsDislikeTotals={this.props.userView.user_view_posts_dislikes_totals}
                  onLikeOrDislike={this.onLikeOrDislike}
                  onLikeAndDislikeTotals={this.onLikeAndDislikeTotals}
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
    userView: state.userView,
    user_id: state.user.user_id,
    access_token: state.user.access_token,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    addPost: addPost,
    setUserView: setUserView,
    replaceUserViewPosts: replaceUserViewPosts,
    addUserViewPP: addUserViewPP,
    replacePageTitle: replacePageTitle,
    replaceUserViewPostsLikesDislikes: replaceUserViewPostsLikesDislikes,
    replaceUserViewPostsLikesAndDislikesTotals: replaceUserViewPostsLikesAndDislikesTotals,
  }, dispatch)
}



export default withRouter(connect(mapStateToProps, matchDispachToProps,)(UserView));
