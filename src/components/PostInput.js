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
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

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
        post: this.state.value,
        type: 0
      }

      axios.post('http://localhost:8000/plush-api/post', JSON.stringify(post), {headers: {'Authorization': this.props.access_token}}).then(res => {
        if('Error' in res.data) {
          console.log(res.Data.Error);
        } else {
          this.props.onAddPost(res.data)

          this.getLikesAndDislikesTotals();

        }
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
      })

      this.setState({
        value: '',
      });
    }
  };

  handleImageSubmit(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {

      let post = {
        user_id: this.props.user_id,
        post_id: uuid.v1().toString(),
        post: "",
        type_of_post: 1,
      }

      axios.post('http://localhost:8000/plush-api/post', JSON.stringify(post),  {headers: {'Authorization': this.props.access_token}}).then(res4 => {
          if('Error' in res4.data) {
            console.log(res4.data.Error);
          } else {
            var picture_info = {
              image_name: res4.data.Post,
              data: reader.result
            }
            
            // axios.post('http://localhost:8001/plush-file-server/postImage', JSON.stringify(picture_info),  {headers: {'Authorization': this.props.access_token}}).then(res5 => {
            //   if('Error' in res5.data) {
            //     console.log(res5.data.Error);
            //   } else {
            //     this.props.onAddPostImage(res5.data)
            //     this.getLikesAndDislikesTotals();
            //   }
            // }).catch(err => {
            //    console.log(err);
            //     // Handle the error here. E.g. use this.setState() to display an error msg.
            // })
          }
      }).catch(err => {
        console.log(err);
     })
    }
    reader.readAsDataURL(file)
  }

  getLikesAndDislikesTotals = () => {
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

  render() {
    return (
      <Row>
        <Col xs={10}>
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
        <Col xs={2}>
          <Row end="xs">
            <FloatingActionButton style={{marginTop: "3%", marginRight: "10%"}} mini={true} containerElement='label'>
              <input type="file"
                className="inputfile"
                id="fileInput"
                style={{display:"none", overflow:"hidden"}}
                onChange={(e)=>this.handleImageSubmit(e)}
               />
               <PhotoCamera/>
            </FloatingActionButton>
            <FloatingActionButton style={{marginTop: "3%", marginRight: "10%"}} mini={true}
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
