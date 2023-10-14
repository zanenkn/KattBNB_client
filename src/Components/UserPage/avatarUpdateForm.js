import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import AvatarEditor from 'react-avatar-editor';
import Popup from 'reactjs-popup';
import Spinner from '../../common/Spinner';
import { Avatar, Button, Text, Notice, Container } from '../../UI-Components';
import { Edit, Camera, RotateLeft, RotateRight } from '../../icons';
import { AvatarEditBtnWrapper, AvatarUpdateFormWrapper, FlexWrapper, WithCursorPointer } from './styles';

const AvatarUpdateForm = ({ image, userId, username, closeAllForms }) => {
  const { t, ready } = useTranslation('AvatarUpdateForm');

  const [avatar, setAvatar] = useState({
    image: '',
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const editor = useRef(null);
  const noAvatar = `https://ui-avatars.com/api/?name=${username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`;

  const handleNewImage = (e) => {
    setAvatar((prev) => ({
      ...prev,

      image: e.target.files[0],
      position: { x: 0.5, y: 0.5 },
    }));
    setErrors([]);
  };

  const rotateLeft = () => {
    if (avatar.image !== '') {
      setAvatar((prev) => ({
        ...prev,

        rotate: prev.rotate - 90,
      }));
    }
  };

  const rotateRight = () => {
    if (avatar.image !== '') {
      setAvatar((prev) => ({
        ...prev,

        rotate: prev.rotate + 90,
      }));
    }
  };

  const handlePositionChange = (position) => {
    setAvatar((prev) => ({
      ...prev,

      position: position,
    }));
  };

  const updateAvatar = (e) => {
    if (avatar.image === '') {
      setLoading(false);
      setErrors(['AvatarUpdateForm:no-avatar-error']);
    } else if (
      avatar.image.type !== 'image/jpeg' &&
      avatar.image.type !== 'image/jpg' &&
      avatar.image.type !== 'image/png' &&
      avatar.image.type !== 'image/gif'
    ) {
      setLoading(false);
      setErrors(['AvatarUpdateForm:file-type-error']);
    } else {
      const lang = detectLanguage();
      setLoading(true);
      const img = editor.current.getImageScaledToCanvas().toDataURL();
      const path = `/api/v1/users/${userId}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const payload = {
        profile_avatar: Array.from(new Set([img])),
        locale: lang,
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      axios
        .put(path, payload, { headers: headers })
        .then(() => {
          setErrors([]);
          window.location.reload();
        })
        .catch((error) => {
          setLoading(false);

          if (error.response === undefined || error.response.status === 500) {
            setErrors(['reusable:errors:unknown']);
            return;
          }
          if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/login');
            return;
          }
          setErrors(error.response.data.errors);
        });
    }
  };

  const closeModal = () => {
    setLoading(false);
    setErrors([]);
  };

  if (!ready) return <Spinner />;

  return (
    <AvatarUpdateFormWrapper onClick={closeAllForms}>
      <Avatar data-cy='avatar' centered src={image === null ? noAvatar : image} />
      <Popup
        modal
        className='avatar-popup'
        trigger={
          <AvatarEditBtnWrapper data-cy='avatar-update-cta'>
            <Edit height={3} color='neutral' tint={0} />
          </AvatarEditBtnWrapper>
        }
        position='top center'
        closeOnDocumentClick={true}
        onClose={closeModal}
      >
        <Container space={2}>
          <AvatarEditor
            ref={editor}
            width={258}
            height={258}
            position={avatar.position}
            onPositionChange={() => handlePositionChange()}
            rotate={parseFloat(avatar.rotate)}
            borderRadius={129}
            image={avatar.image}
            className='editor-canvas'
          />

          <FlexWrapper centered spaceBetween={6} space={6}>
            <WithCursorPointer>
              <label htmlFor='files' style={{ cursor: 'inherit' }}>
                <Camera height={7} tint={80} />
              </label>
              <input
                data-cy='add-photo'
                id='files'
                style={{ display: 'none' }}
                onChange={(e) => handleNewImage(e)}
                type='file'
              />
            </WithCursorPointer>
            <WithCursorPointer onClick={() => rotateLeft()}>
              <RotateLeft height={7} tint={avatar.image === '' ? 60 : 80} />
            </WithCursorPointer>
            <WithCursorPointer onClick={() => rotateRight()}>
              <RotateRight height={7} tint={avatar.image === '' ? 60 : 80} />
            </WithCursorPointer>
          </FlexWrapper>
          {errors.length > 0 && (
            <Notice data-cy='errors' nature='danger'>
              <Text bold centered size='sm'>
                {t('reusable:errors.action-error-header')}
              </Text>
              <Text size='sm'>
                <ul id='message-error-list'>
                  {errors.map((error) => (
                    <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
                  ))}
                </ul>
              </Text>
            </Notice>
          )}
          <Button space={0} data-cy='save-avatar' disabled={loading} loading={loading} onClick={updateAvatar}>
            {t('reusable:cta:save')}
          </Button>
        </Container>
      </Popup>
    </AvatarUpdateFormWrapper>
  );
};

export default AvatarUpdateForm;
