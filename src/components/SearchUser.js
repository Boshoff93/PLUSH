import React from 'react';
import {bindActionCreators} from 'redux'
import {addPost} from '../actions/addPost';
import {connect} from 'react-redux'
import uuid from 'uuid';

export class SearchUser extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  getUserView(name) {
    this.props.socket.emit('get user', {name});
  }

  handleSubmit = (target) => {
    if(target.charCode==13){
      this.getUserView(this.state.value)
      this.setState({
        value: '',
      });
    }
  };

  render() {
    return (
      <div className="ui left icon input" type="Submit" onSubmit={() => this.handleSubmit()}>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type="text"
          placeholder="Search users..."
          onKeyPress={this.handleSubmit}
          ></input>
        <i className="users icon"></i>
      </div>
    );
  }
}


export default SearchUser
