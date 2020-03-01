import React, { useState } from 'react'
import ImageUploader from 'react-images-upload'
import { Icon } from 'semantic-ui-react'

const ImageUploadPopup = (props) => {

  const [button, setButton] = useState(true)
  const [image, setImage] = useState('')

  const onImageDropHandler = (picture) => {
    if (picture) {
      setButton(false)
      setImage(picture)
    } else {
      
      setButton(true)
    }
    debugger
  }

  return (
    <ImageUploader
      buttonText={
        <div>
          <p id="add-photo-headline">1. Add a photo!</p>
          <Icon id="add-photo-icon" name="image outline" size="huge"></Icon>
          <p id="add-photo-label">Maximum image file size: 5 MB</p>
        </div>
      }
      //buttonClassName={this.state.button}
      buttonStyles={button ? { 'display': 'block' } : { 'display': 'none' }}
      withLabel={false}
      withIcon={false}
      withPreview={true}
      singleImage={true}
      onChange={() => onImageDropHandler()}
      imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
      maxFileSize={5242880}
    //errorClass={(this.state.image.length > 0) ? 'image-upload-error-hidden' : 'image-upload-error-visible'}
    />
  )
}

export default ImageUploadPopup