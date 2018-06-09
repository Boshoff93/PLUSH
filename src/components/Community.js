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


class Community extends React.Component {
  state = {
    loggedIn: false,
    onProfile: true,
    userViewId: '',
    redirect: false,
    followerPage: false,
    searchUsers: [],
    searchUsersIds: [],
    searchUsersAvatars: [],
    path: '',
    open: false,
    value: 0,
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
    axios.get('http://localhost:8000/plush-api/getFollowCounts/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res => {
      if('Error' in res.data) {
        console.log(res.Data.Error)
      } else {
        let data = res.data
        this.onGetFollowCount(data)
      }
    }).catch(err => {
      console.log(err);
    })
  }

  onGetFollowCount = (counts) => {
    this.props.replaceFollowCount(counts.FollowerCount, counts.FollowingCount);
  }

  render() {
    if (!this.state.loggedIn) {
      return <Redirect push to={`/`}/>;
    }
    const imageUrl = require(`../Images/loginBackground.png`)
    const { value } = this.state.value;
    return (
      <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", minHeight:"100vh", height:"auto", overflowY: "auto"}}>
        <Grid >
          <Row center="xs">
            <Col xs={4}>
              <AppBar position="static" color="default" style={{marginTop:"5%",borderRadius: "10px"}}>
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  fullWidth
                  indicatorColor='primary'
                  style={{margin:"10px 4%"}}
                >
                  <Tab icon={<Avatar style={{backgroundColor:"#FF5522", color:"white"}}>{this.props.following_count}</Avatar>} label="Following" style={{fontFamily:"Risque"}} />
                  <Tab icon={<Avatar style={{backgroundColor:"#FF5522", color:"white"}}>{this.props.followers_count}</Avatar>} label="Folowers" style={{fontFamily:"Risque"}} />
                </Tabs>
              </AppBar>

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
    user_id: state.user.user_id,
    followers_count: state.user.followers_count,
    following_count: state.user.following_count,
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    replaceFollowCount: replaceFollowCount,
  }, dispatch)
}


export default withRouter(connect(mapStateToProps, matchDispachToProps)(Community));
