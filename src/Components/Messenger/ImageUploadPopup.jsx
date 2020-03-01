import React, { Component } from 'react'
import ImageUploader from 'react-images-upload'
import { Icon } from 'semantic-ui-react'

class ImageUploadPopup extends Component {

  state = {
    button: true,
    image: ''
  }

  onImageDropHandler = (pictureFiles, pictureDataURLs) => {
    if (pictureFiles.length > 0) {
      this.setState({
        button: false,
        image: pictureFiles[0]
      })
    } else {
      this.setState({
        button: true,
        image: ''
      })
    }
  }

  render() {
    return (
      <ImageUploader
        buttonText={
          <div>
            <p id="add-photo-headline">1. Add a photo!</p>
            <Icon id="add-photo-icon" name="image outline" size="huge"></Icon>
            <p id="add-photo-label">Maximum image file size: 5 MB</p>
          </div>
        }
        buttonStyles={this.state.button ? { 'display': 'block' } : { 'display': 'none' }}
        withLabel={false}
        withIcon={false}
        withPreview={true}
        singleImage={true}
        onChange={this.onImageDropHandler}
        imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
      />
    )
  }
}

export default ImageUploadPopup
