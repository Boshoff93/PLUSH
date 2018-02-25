import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {bindActionCreators} from 'redux'
import {signOut} from '../actions/signOut';
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"

class AppBarHeader extends React.Component {
  state = {
    loggedIn: true
  }

  logOut = () => {
    this.setState({
      loggedIn:false
    })
    this.props.signOut()
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
        fontSize: "20px"}}
        onClick={() => this.logOut()}
      />
    </IconMenu>
  );

  render() {
    if(!this.state.loggedIn) {
      return <Redirect push to={"/"}/>
    }
    return (
      <AppBar
        title="PLUSH"
        style={{width: "100%"}}
        titleStyle={{fontFamily:"Risque"}}
        iconElementRight={<this.Logged />}
      />
    );
  }
}


function matchDispachToProps(dispatch) {
  return bindActionCreators({
    signOut: signOut
  }, dispatch)
}

export default connect(null,matchDispachToProps)(AppBarHeader);
