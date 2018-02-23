import React from 'react';
import {bindActionCreators} from 'redux'
import {setUser} from '../../actions/setUser';
import {signOut} from '../../actions/signOut';
import {connect} from 'react-redux'
import "../../App.css"
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import uuid from 'uuid';
import {fire, googleProvider, facebookProvider} from './Config'
import {FacebookLoginButton, GoogleLoginButton, TwitterLoginButton} from 'react-social-login-buttons';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';



const style = {
  margin: "0, auto",
  display: 'inline-block',
};

class Login extends React.Component{
  state = {
    redirect: false,
    unsuccessful: false,
  }

  onAddUser = (user) => {
    this.props.setUser(user.Display_Name, user.Email, user.User_Id, user.Token)
    this.setState({
      redirect: true,
      unsuccessful: false,
    });
  }

  onUnSuccessful = () => {
    this.setState({
      unsuccessful : true
    });
    console.log("Permission Dinied");
  }

  responseGoogle = (response) => {
    console.log(response);
    let user_info = {
      display_name: response.user.displayName,
      user_id: response.user.uid,
      created_at: uuid.v1().toString(),
    }
    axios.post('http://localhost:8000/plush-api/login', JSON.stringify(user_info), {headers: {'Authorization': response.credential.idToken} }).then(res => {
      if('Error' in res.data) {
        this.onUnSuccessful()
      } else {
        this.onAddUser(res.data)
      }
    }).catch(err => {
      // Handle the error here. E.g. use this.setState() to display an error msg.
   })
  }

  signOut = () => {
    fire.auth().signOut().then(() => {
      this.props.signOut()
    })
  }

  authWithGoogle = () => {
    console.log("authed with google");
    fire.auth().signInWithPopup(googleProvider).then((result,error) => {
      if(error) {
        console.log("Error could not connect");
      } else {
        this.responseGoogle(result)
      }
    })
  }

  render(){
    const imageUrl = require(`../../Images/test.jpg`)
    if (this.state.redirect === true) {
      return <Redirect push to="/profile" />;
    } else {
      return (
        <div style={{ backgroundImage: `url(${imageUrl})`, width:"100%", height:"100vh"}}>
        <Grid style={{marginTop:"10%"}}>
          <Row >
            <Col xs={12}>
              <Row center="xs">
                <Col xs={6}>
                  <Paper style={style} zDepth={3}>
                    <FacebookLoginButton onClick={() => alert('Hello')} />
                    <GoogleLoginButton onClick={() => alert('Hello')} />
                    <TwitterLoginButton onClick={() => alert('Hello')} />
                  </Paper>
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
        </div>

      )
    }
  }
}


function matchDispachToProps(dispatch) {
  return bindActionCreators({
    setUser: setUser,
    signOut: signOut
  }, dispatch)
}

export default connect(null,matchDispachToProps)(Login);
