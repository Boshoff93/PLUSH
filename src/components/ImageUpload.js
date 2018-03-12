import React from 'react';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';

class ImageUpload extends React.Component {

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var picture = {
        path: "./images/" + this.props.user_id + "/profile_picture/",
        user_id: this.props.user_id,
        data: reader.result
      }
      // var getPath = {
      //   path: "./images/" + this.props.user_id + "/profile_picture/" + this.props.user_id + "_pp_image",
      //   user_id: this.props.user_id,
      //   data: reader.result
      // }
      //axios.post('http://localhost:8001/plush-file-server/getProfilePicture', JSON.stringify(getPath), {headers: {'Authorization': this.props.access_token}}).then(res => {
      //axios.post('http://localhost:8001/plush-file-server/addProfilePicture', JSON.stringify(picture),  {headers: {'Authorization': this.props.access_token}}).then(res => {
      axios.post('http://localhost:8000/plush-api/profilePicture', JSON.stringify(picture),  {headers: {'Authorization': this.props.access_token}}).then(res => {
          if('Error' in res.data) {
            console.log(res.Data.Error);
          } else {
            console.log(res.data);
            //this.props.onAddProfilePicture(res.data)
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
