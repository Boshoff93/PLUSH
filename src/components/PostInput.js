import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Row, Col } from 'react-flexbox-grid';

export class PostInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    if(this.state.value !== ""){
      let post = {
        user_id: this.props.user_id,
        post_id: uuid.v1().toString(),
        post: this.state.value
      }

      axios.post('http://localhost:8000/plush-api/post', JSON.stringify(post), {headers: {'Authorization': this.props.access_token}}).then(res => {
        if('Error' in res.data) {
          console.log(res.Data.Error);
        } else {
          this.props.onAddPost(res.data)
        }
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })
      this.setState({
        value: '',
      });
    }
  };

  render() {
    return (
      <Row>
        <Col xs={11}>
          <Row center="xs">
            <TextField
              style={{width: "90%"}}
              hintText="Tell people what's on your mind"
              hintStyle={{color:"#FF5522"}}
              onChange={this.onChange}
              value={this.state.value}
            />
          </Row>
        </Col>
        <Col xs={1}>
          <Row style={{marginTop: "7%"}}>
            <FloatingActionButton mini={true}
              onClick={() => this.handleSubmit()}
            >
              <ContentAdd />
            </FloatingActionButton>
          </Row>
        </Col>
      </Row>
    );
  }
}


export default PostInput
