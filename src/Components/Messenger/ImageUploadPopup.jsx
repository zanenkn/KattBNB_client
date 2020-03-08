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
        buttonStyles={{ 'position': 'relative', 'margin': '0', 'width': '100%', 'height': '8rem', 'background': '#eeeeee', 'borderRadius': '0', 'display': props.imageUploadButton ? 'block' : 'none' }}
        withLabel={false}
        withIcon={false}
        withPreview={props.uploadedImage === '' ? false : true}
        singleImage={true}
        onChange={props.onImageDropHandler}
        imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
        maxFileSize={5242880}
      />
      <div>
        <svg
          style={{ 'position': 'absolute', 'right': '1.3rem', 'top': '1.3rem', 'margin': '0', 'height': '2rem', 'display': (props.uploadedImage === '' || props.loadingUploadButton) ? 'none' : 'block' }}
          onClick={props.clearImage}
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
        >
          <circle cx="50%" cy="50%" r="50%" fill="#ffffff" />
          <path fill='#c90c61' d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.4 10l2.83-2.83-1.41-1.41L10 8.59 7.17 5.76 5.76 7.17 8.59 10l-2.83 2.83 1.41 1.41L10 11.41l2.83 2.83 1.41-1.41L11.41 10z" />

        </svg>
        <p className='small-centered-paragraph' style={{ 'marginTop': '1rem' }}>
          Maximum file size: 5 MB
          <br />
          Supported file formats: jpg, png, gif
        </p>
      </div>
      <Button
        onClick={props.handleSendEvent}
        disabled={(props.uploadedImage === '' || props.loadingUploadButton) && true}
        loading={props.loadingUploadButton}
      >
        Send
      </Button>
    </>
  )
}

export default ImageUploadPopup
