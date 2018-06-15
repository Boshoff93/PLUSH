import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import {bindActionCreators} from 'redux'
import {signOut} from '../actions/signOut'
import {replacePageTitle} from '../actions/replacePageTitle'
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"
import {fire} from './forms/Config'
import Drawer from 'material-ui/Drawer';
import {Row, Col } from 'react-flexbox-grid';

class AppBarHeader extends React.Component {
  state = {
    loggedIn: true,
    open: false,
    home_page: false,
    profile_page: false,
    my_community_page: false,
    right_page_caption: this.props.page_title,
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleHome = () => {
    var curState = this.state
    curState.open = false
    if (this.props.current_loc !== "/home") {
      curState.home_page = true
      this.updatePageTitle("HOME")
    }

    this.setState({
      curState
    })
  }

  handleProfile = () => {
    var curState = this.state
    curState.open = false
    if (this.props.current_loc !== "/profile") {
      curState.profile_page = true
      this.updatePageTitle("PROFILE")
    }
    this.setState({
      curState
    })
  }

  handleMyCommunity = () => {
    var curState = this.state
    curState.open = false
    if (this.props.current_loc !== "/my_community") {
      curState.my_community_page = true
      this.updatePageTitle("MY COMMUNITY")
    }
    this.setState({
      curState
    })
  }

  updatePageTitle = (title) => {
    this.props.replacePageTitle(title)
  }

  logOut = () => {
    this.setState({
      loggedIn:false
    })
    fire.auth().signOut().then(() => {
      this.props.signOut()
    })
  }

  Logged = (props) => (
    <div style={{fontFamily: "Risque"}}>
    <Row>
     <Col style={{display: "inline-block", color: "white", fontSize:"20px", whiteSpace: "nowrap"}}>
      {this.props.page_title === "MY COMMUNITY" ?
      <div style={{paddingTop: "8%"}}>
        {this.props.page_title}
      </div>
      : this.props.page_title === "HOME" ?
      <div style={{paddingTop: "23%"}}>
        {this.props.page_title}
      </div>
      : this.props.page_title === "USER" ?
      <div style={{paddingTop: "25%"}}>
        {this.props.page_title}
      </div>
      :
      <div style={{paddingTop: "15%"}}>
        {this.props.page_title}
      </div>
      }
      </Col>
      <Col>
      <IconMenu iconStyle={{color: "white"}}
        iconButtonElement={
          <IconButton><MoreVertIcon/></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem
          primaryText="Sign out"
          style={{fontFamily:"Risque",
          paddingTop: "10px",
          fontSize: "20px",
          backgroundColor:"#173777",
          color:"white"
          }}
          onClick={() => this.logOut()}
        />
      </IconMenu>
      </Col>
      </Row>
    </div>
  );

  render() {
    if(!this.state.loggedIn) {
      return <Redirect push to={"/"}/>
    }
    if(this.state.home_page) {
        return <Redirect push to={"/home"}/>
    }
    if(this.state.profile_page) {
        return <Redirect push to={"/profile"}/>
    }

    if(this.state.my_community_page) {
        return (
          <div>
            <AppBar
              title="PLUSH"
              style={{width: "100%"}}
              titleStyle={{fontFamily:"Risque"}}
              iconElementRight={<this.Logged />}
              onLeftIconButtonClick={this.handleToggle}
            />
            <Drawer
              docked={false}
              open={this.state.open}
              onRequestChange={(open) => this.setState({open})}
              containerStyle={{ backgroundColor: '#173777' }}
            >
              <MenuItem style={{fontFamily:"Risque", color:"white"}} onClick={this.handleHome}>Home</MenuItem>
              <MenuItem style={{fontFamily:"Risque", color:"white"}} onClick={this.handleProfile}>My Profile</MenuItem>
              <MenuItem style={{fontFamily:"Risque", color:"white"}} onClick={this.handleMyCommunity}>My Community</MenuItem>
            </Drawer>
            <Redirect push to={"/my_community"}/>
          </div>
        )
    }
    return (
      <div>
        <AppBar
          title="PLUSH"
          style={{width: "100%"}}
          titleStyle={{fontFamily:"Risque"}}
          iconElementRight={<this.Logged />}
          onLeftIconButtonClick={this.handleToggle}
        />
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
          containerStyle={{ backgroundColor: '#173777' }}
        >
          <MenuItem style={{fontFamily:"Risque", color:"white"}} onClick={this.handleHome}>Home</MenuItem>
          <MenuItem style={{fontFamily:"Risque", color:"white"}} onClick={this.handleProfile}>My Profile</MenuItem>
          <MenuItem style={{fontFamily:"Risque", color:"white"}} onClick={this.handleMyCommunity}>My Community</MenuItem>
        </Drawer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    page_title: state.user.page_title
  }
}

function matchDispachToProps(dispatch) {
  return bindActionCreators({
    signOut: signOut,
    replacePageTitle: replacePageTitle,
  }, dispatch)
}

export default connect(mapStateToProps,matchDispachToProps)(AppBarHeader);
