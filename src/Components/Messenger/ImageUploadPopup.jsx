import React from 'react'
import ImageUploader from 'react-images-upload'
import { Icon, Button } from 'semantic-ui-react'

const ImageUploadPopup = (props) => {

  return (
    <>
      <ImageUploader
        buttonText={
          <Icon.Group size='huge' color='white'>
            <Icon name='photo' />
            <Icon
              corner='bottom right'
              name='add'
              style={{ 'textShadow': 'none', 'color': '#c90c61' }}
            />
          </Icon.Group>

        }
        fileContainerStyle={{ 'boxShadow': 'none', 'padding': '0', 'margin': '0' }}
        buttonStyles={{ 'margin': '0', 'width': '100%', 'height': '8rem', 'background': '#eeeeee', 'borderRadius': '0', 'display': props.imageUploadButton ? 'block' : 'none' }}
        withLabel={false}
        withIcon={false}
        withPreview={true}
        singleImage={true}
        onChange={props.onImageDropHandler}
        imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
      />
      <div>
        <p className='small-centered-paragraph' style={{ 'marginTop': '1rem' }}>
          Maximum file size: 5 MB
          <br />
          Supported file formats: jpg, png, gif
        </p>
      </div>
      <Button
        onClick={props.handleSendEvent}
        disabled={props.uploadedImage === '' && true}
      >
        Send
        </Button>
    </>
  )
}

export default ImageUploadPopup
