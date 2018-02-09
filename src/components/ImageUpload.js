import React from 'react';
import { Button, Icon } from 'semantic-ui-react'

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
      this.props.socket.emit('profile picture add', picture);
    }

    reader.readAsDataURL(file)
  }

  render() {
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
