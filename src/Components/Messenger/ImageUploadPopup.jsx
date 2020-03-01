import React from 'react'
import ImageUploader from 'react-images-upload'
import { Icon, Button } from 'semantic-ui-react'

const ImageUploadPopup = (props) => {

  return (
    <>
      <ImageUploader
        buttonText={
          <div>
            <p id="add-photo-headline">1. Add a photo!</p>
            <Icon id="add-photo-icon" name="image outline" size="huge"></Icon>
            <p id="add-photo-label">Maximum image file size: 5 MB</p>
          </div>
        }
        buttonStyles={props.imageUploadButton ? { 'display': 'block' } : { 'display': 'none' }}
        withLabel={false}
        withIcon={false}
        withPreview={true}
        singleImage={true}
        onChange={props.onImageDropHandler}
        imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
      />
      <Button onClick={props.handleSendEvent} >Upload</Button>
    </>
  )
}

export default ImageUploadPopup
