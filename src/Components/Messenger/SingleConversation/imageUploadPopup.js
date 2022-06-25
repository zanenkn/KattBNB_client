import { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { Camera, Close } from '../../../icons';
import { Button, Flexbox, Header, Text, Notice } from '../../../UI-Components';
import { ImagePreview, ImageUploadArea, RoundButton } from './styles';

const ImageUploadPopup = ({ t, loadingUploadButton, uploadedImage, onImageChange, clearImage, handleSendEvent }) => {
  const [errors, setErrors] = useState([]);
  const allowedFileTypes = ['jpg', 'jpeg', 'png'];

  const onUpload = (e) => {
    setErrors([]);
    const reader = new FileReader();
    const file = e.target.files[0];

    if (file.size > 5242880) {
      setErrors((prev) => [...prev, 'SingleConversation:errors.too-large-file']);
      return;
    }

    if (!allowedFileTypes.includes(file.type.split('/')[1])) {
      setErrors((prev) => [...prev, 'SingleConversation:errors.unsupported-file-format']);
      return;
    }

    reader.onloadend = () => {
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
    file && reader.readAsDataURL(file);
  };

  return (
    <>
      {uploadedImage && !errors.length ? (
        <ImagePreview>
          <RoundButton onClick={clearImage}>
            <Close fill={'white'} />
          </RoundButton>
          <img src={uploadedImage} style={{ maxWidth: '100%' }} />
        </ImagePreview>
      ) : (
        <>
          <Header centered level={4}>
            {t('SingleConversation:send-picture')}
          </Header>
          <ImageUploadArea>
            <label onChange={(e) => onUpload(e)}>
              <input type='file' />
              <Flexbox direction={'column'}>
                <Camera height={10} fill={'neutral'} tint={40} />
                <Text color={'neutral'} tint={60} size='base'>
                  {t('SingleConversation:browse')}
                </Text>
              </Flexbox>
            </label>
          </ImageUploadArea>
        </>
      )}
      {errors.length > 0 ? (
        <Notice data-cy='error-notice' nature='danger'>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Notice>
      ) : (
        <Text centered>
          {t('SingleConversation:file-size')}
          <br />
          {t('SingleConversation:supported-formats')}
        </Text>
      )}

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
