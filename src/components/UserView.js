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
import { Image, Label } from 'semantic-ui-react'
import axios from 'axios';

class UserView extends React.Component {
  state = {
    loggedIn: false,
    onProfile: false,
    redirect: false,
    preventHistoryPush: 0,
    searchUsers: [],
    searchUsersIds: [],
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

      axios.get('http://localhost:8000/plush-api/profilePicture/' + user.User_Id,  {headers: {'Authorization': this.props.access_token}}).then(res => {
        if('Error' in res.data) {
          console.log(res.Data.Error);
        } else {
          let data = res.data
          this.onGetProfilePicture(data)
        }
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })

      let newState = this.state
      newState.userViewId = user.User_Id
      newState.searchUsers = []
      newState.searchUsersIds = []
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
      this.props.addUserViewPP(blob.Data);
    } else {
      this.props.addUserViewPP(require("../Images/DefaultAvatar.png"));
    }
  }

  onSearchUsers = (users) => {
      this.setState({
        searchUsers: users.Display_Names,
        searchUsersIds: users.User_Ids
      });
  }

  render() {
    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }
    return (
      <div className="ui container">
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui segment center aligned Border-orange">
          <Label pointing='below' basic color='orange' size='big'>{this.props.userView.userViewDisplayName}</Label>
          <Image className = "Profile-border" src={this.props.userView.userViewProfilePicture}/>
          </div>
          <div>
            <SearchUser
              onProfile={this.state.onProfile}
              user_id={this.props.user_id}
              onSearchUsers={this.onSearchUsers}
              onGetUser={this.onGetUser}
              searchUsers={this.state.searchUsers}
              searchUsersIds={this.state.searchUsersIds}
              access_token={this.props.access_token}
            />
          </div>
        </div>
        <div className="twelve wide column">
          <div className="ui segment center aligned Border-orange">
            <div className='Plush-blue Plush-font Plush-margin'>
                PLUSH WALL POSTS
              </div>
              <div className='ui left aligned segment Border-orange Postview-format'>
                <UserPostView
                  posts={this.props.userView.userViewPosts}
                  post_times={this.props.userView.userViewPostTimes}
                  display_name={this.props.userView.userViewDisplayName}
                />
                </div>
              </div>
          </div>
        </div>
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
