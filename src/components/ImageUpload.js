import React from 'react';
import axios from 'axios';
import MenuItem from 'material-ui/MenuItem';

class ImageUpload extends React.Component {

  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      var picture_user_id = {
        user_id: this.props.user_id,
      }
      axios.post('http://localhost:8000/plush-api/profilePicture', JSON.stringify(picture_user_id),  {headers: {'Authorization': this.props.access_token}}).then(res1 => {
          if('Error' in res1.data) {
            console.log(res1.data.Error);
          } else {
            var picture_info = {
              pp_name: res1.data.Pp_Name,
              data: reader.result
            }
            axios.post('http://localhost:8001/plush-file-server/profilePicture', JSON.stringify(picture_info),  {headers: {'Authorization': this.props.access_token}}).then(res2 => {
              if('Error' in res2.data) {
                console.log(res2.data.Error);
              } else {
                this.props.onAddProfilePicture(res2.data)
              }
            }).catch(err => {
               console.log(err);
                // Handle the error here. E.g. use this.setState() to display an error msg.
            })
          }
      }).catch(err => {
        console.log(err);
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
