import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import axios from 'axios';

class ImageUpload extends React.Component {

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var picture = {
        user_id: this.props.user_id,
        data: reader.result
      }
      axios.post('http://localhost:8000/plush-api/profilePicture', JSON.stringify(picture)).then(res => {
          this.props.onAddProfilePicture(res.data)
      }).catch(err => {
        // Handle the error here. E.g. use this.setState() to display an error msg.
     })
    }
    reader.readAsDataURL(file)
  }

  render() {
    if(this.props.loaded === false) {
      return false
    }
    return (
      <div>
      <input type="file"
        className="inputfile"
        id="fileInput"
        style={{display:"none", overflow:"hidden"}}
        onChange={(e)=>this.handleImageChange(e)}

       />
      <label htmlFor="fileInput" className="ui inverted orange button">
        <i className="ui upload icon"></i>
        Upload Image!
      </label>
      </div>

    )
  }
}

export default ImageUpload;
