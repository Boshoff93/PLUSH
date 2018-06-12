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
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"
import {fire} from './forms/Config'
import Drawer from 'material-ui/Drawer';

class AppBarHeader extends React.Component {
  state = {
    loggedIn: true,
    open: false,
    home_page: false,
    profile_page: false,
    my_community_page: false,
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleHome = () => {
    var curState = this.state
    curState.open = false
    if (this.props.current_loc !== "/home") {
      curState.home_page = true
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
    }
    this.setState({
      curState
    })
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
            <Redirect push to={"/my_community"}/>
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


function matchDispachToProps(dispatch) {
  return bindActionCreators({
    signOut: signOut
  }, dispatch)
}

export default connect(null,matchDispachToProps)(AppBarHeader);
