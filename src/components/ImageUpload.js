import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';

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
      axios.post('http://localhost:8000/plush-api/profilePicture', JSON.stringify(picture),  {headers: {'Authorization': this.props.access_token}}).then(res => {
          if('Error' in res.data) {
            console.log(res.Data.Error);
          } else {
            this.props.onAddProfilePicture(res.data)
          }

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
      <MenuItem
        primaryText="Upload Profile Picture"
        style={{textAlign: "center",  borderRadius: "25px", margin: "0px 10px"}}
        containerElement='label'
      >
      <input type="file"
        className="inputfile"
        id="fileInput"
        style={{display:"none", overflow:"hidden"}}
        onChange={(e)=>this.handleImageChange(e)}
       />
      </MenuItem>
    )
  }
}

export default ImageUpload;
