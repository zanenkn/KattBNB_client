import { Camera } from '../../../icons';
import { Button, Flexbox, Header, Text } from '../../../UI-Components';
import Resizer from 'react-image-file-resizer';
import { ImagePreview, ImageUploadArea } from './styles';

const ImageUploadPopup = ({ t, loadingUploadButton, uploadedImage, onImageChange, clearImage, handleSendEvent }) => {
  const onUpload = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      // TODO: handle file size and file type errors here
      Resizer.imageFileResizer(
        e.target.files[0],
        750,
        750,
        'JPEG',
        100,
        0,
        (uri) => {
          onImageChange(uri);
        },
        'base64',
        200,
        200
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {uploadedImage ? (
        <ImagePreview>
          <svg onClick={clearImage} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
            <circle cx='50%' cy='50%' r='50%' fill='#ffffff' />
            <path
              fill='#c90c61'
              d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.4 10l2.83-2.83-1.41-1.41L10 8.59 7.17 5.76 5.76 7.17 8.59 10l-2.83 2.83 1.41 1.41L10 11.41l2.83 2.83 1.41-1.41L11.41 10z'
            />
          </svg>
          <img src={uploadedImage} style={{ maxWidth: '100%' }} />
        </ImagePreview>
      ) : (
        <>
          <Header centered level={4}>
            Send a picture
          </Header>
          <ImageUploadArea>
            <label onChange={(e) => onUpload(e)}>
              <input type='file' />
              <Flexbox direction={'column'}>
                <Camera height={10} fill={'neutral'} tint={40} />
                <Text color={'neutral'} tint={60} size='base'>
                  Browse to upload
                </Text>
              </Flexbox>
            </label>
          </ImageUploadArea>
        </>
      )}
      <Text centered>
        {t('SingleConversation:file-size')}
        <br />
        {t('SingleConversation:supported-formats')}
      </Text>
      <Button
        onClick={handleSendEvent}
        disabled={(uploadedImage === '' || loadingUploadButton) && true}
        loading={loadingUploadButton}
      >
        {t('SingleConversation:cta-send')}
      </Button>
    </>
  );
};

export default ImageUploadPopup;
