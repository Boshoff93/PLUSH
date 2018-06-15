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

          axios.get('http://localhost:8000/plush-api/getLikesAndDislikes/' + this.props.user_id, {headers: {'Authorization': this.props.access_token}}).then(res2 => {
            if('Error' in res2.data) {
              console.log(res2.Data.Error)
            } else {
              let data = res2.data
              console.log(data);
              this.props.onLikeOrDislike(data);
            }
          }).catch(err => {
            console.log(err);
          })


          axios.get('http://localhost:8000/plush-api/getPostsLikesAndDislikesTotals/' + this.props.post_ids, {headers: {'Authorization': this.props.access_token}}).then(res3 => {
            if('Error' in res3.data) {
              console.log(res3.Data.Error)
            } else {
              let data = res3.data
              this.props.onLikeAndDislikeTotals(data);
            }
          }).catch(err => {
            console.log(err);
          })

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
              style={{width: "90%", fontFamily:"Risque"}}
              hintText="Tell people what's on your mind"
              hintStyle={{color:"#FF5522", fontFamily:"Risque"}}
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
