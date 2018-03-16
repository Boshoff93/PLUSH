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

class UserView extends React.Component {
  state = {
    loggedIn: false,
    onProfile: false,
    redirect: false,
    preventHistoryPush: 0,
    searchUsers: [],
    searchUsersIds: [],
    searchUsersAvatars: [],
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
      });
    }
  }

  getUser = () => {
    axios.get('http://localhost:8000/plush-api/userViewId/' + this.props.match.params.id,  {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error);
      } else {
        this.onGetUser(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
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
      this.props.replaceUserViewPosts([], [])
    } else {
      this.props.replaceUserViewPosts(posts.Posts, posts.Post_Times)
    }
  }

  onError(error){
    //do nothing
  }

  onGetUser = (user) => {
   if(user.User_Id !== "") {
      this.props.setUserView(user.Display_Name, user.User_Id);

      axios.get('http://localhost:8000/plush-api/getposts/' + user.User_Id,  {headers: {'Authorization': this.props.access_token}}).then(res => {
        if('Error' in res.data) {
          console.log(res.Data.Error);
        } else {
          let data = res.data
          this.onGetPosts(data)
        }
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })

      axios.get('http://localhost:8000/plush-api/profilePicture/' + user.User_Id,  {headers: {'Authorization': this.props.access_token}}).then(res1 => {
        if('Error' in res1.data) {
          console.log(res1.Data.Error);
        } else {
          axios.get('http://localhost:8001/plush-file-server/profilePicture/' + res1.data.Pp_Name, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
            if('Error' in res1.data) {
              console.log(res1.Data.Error);
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
      UserView.setState({
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

  render() {
    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }
    const imageUrl = require(`../Images/loginBackground.png`)
    return (
      <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
      <Grid >
        <Row center="xs">
          <Col xs={4} style={{alignItems: "center"}}>
            <Row center="xs">
              <h1 style={{fontFamily:"Risque", marginTop:"10px", color:"white"}}>
                {this.props.userView.userViewDisplayName}
              </h1>
            </Row>
            <Row center="xs">
                <Paper
                  style={{width: "250px", height:"250px", marginTop:"10px"}}
                  circle={true}
                  zDepth={5}
                  >
                  <Avatar src={this.props.userView.userViewProfilePicture} style={{width: "95%", height:"95%", marginTop: "2.5%"}} />
                </Paper>
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
                  posts={this.props.userView.userViewPosts}
                  post_times={this.props.userView.userViewPostTimes}
                  display_name={this.props.userView.userViewDisplayName}
                  profile_picture={this.props.userView.userViewProfilePicture}
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
  }, dispatch)
}



export default withRouter(connect(mapStateToProps, matchDispachToProps,)(UserView));
