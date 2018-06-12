import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import uuid from 'uuid';
import "../App.css"
import "../animations/animations.css"
import "../Images/star.png"
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import {Row, Col } from 'react-flexbox-grid';
import {List} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import TimeAgo from 'react-timeago';

export class UserPostView extends React.Component {

  render() {
      let posts = this.props.posts
      if(posts !== null) {
        posts = this.props.posts.map((post, index) => (
          <Row style={{margin:"1% 0"}}key={uuid.v4()}>
              <Col xs={12}>
                <Row>
                  <Col xs={12}>
                  <Card style={{borderRadius: "25px", marginLeft:"1%",fontFamily:"Risque"}}>
                    <CardHeader
                      title={<div style={{color: "#173777"}}>{this.props.display_name}</div>}
                      subtitle={<TimeAgo date={this.props.post_times[index]} />}
                      avatar={this.props.profile_picture}
                    />
                    <CardText style={{marginLeft:"1%", wordWrap: 'break-word', color:"#FF5522"}}>
                      {post}
                    </CardText>
                    <CardActions>
                      <FlatButton label="Comment" style={{fontFamily:"Risque", color: "#173777"}}/>
                      <FlatButton label="Like" style={{fontFamily:"Risque", color: "#173777"}}/>
                      <FlatButton label="Dislike" style={{fontFamily:"Risque", color: "#173777"}}/>
                    </CardActions>
                  </Card>
                  </Col>
                </Row>
              </Col>
          </Row>
      ));
      }
      if(!{posts}.length) {
        return (
          <List>
            {posts}
          </List>
        );
      } else {
        return (
          <div>
          </div>
        )
      }

      // const posts = this.props.posts.map((post, index) => (
      //   <div className= 'row' key={uuid.v4()}>
      //   <div className= 'fourteen wide column'>
      //   <div className= 'ui segment Border-blue'>
      //     <div className='comment'>
      //       <div className="content">
      //         <a className="author">{this.props.displayName}</a>
      //         <div className="metadata">
      //           <div className="date">{this.props.post_times[index]}</div>
      //         </div>
      //         <div className="text">
      //           {post}
      //         </div>
      //       </div>
      //     </div>
      //     </div>
      //   </div>
      //     <div className= 'two wide column Row-height center aligned middle aligned'>
      //       <Popup
      //         trigger={<Image src={require("../Images/star.png")} avatar />}
      //         content="Rate Post"
      //         />
      //     </div>
      //   </div>
      // ));
      // return (
      //   <div className='ui comments'>
      //   <div className= 'ui grid'>
      //     {posts}
      //     </div>
      //   </div>
      // );
    }
  }

export default UserPostView;
