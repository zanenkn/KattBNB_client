import React, { Component } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import ReactAvatarEditor from 'react-avatar-editor';
import Popup from 'reactjs-popup';
import Spinner from '../../common/Spinner';
import { withTranslation } from 'react-i18next';
import { Avatar, Button, Text, Notice, Container } from '../../UI-Components';
import { Edit, Camera, RotateLeft, RotateRight } from '../../icons';
import { AvatarEditBtnWrapper, AvatarUpdateFormWrapper, FlexWrapper, WithCursorPointer } from './styles';
//MIGRATED
class AvatarUpdateForm extends Component {
  state = {
    loading: false,
    errors: [],
    image: '',
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
  };

  setEditorRef = (editor) => {
    if (editor) this.editor = editor;
  };

  handleNewImage = (e) => {
    this.setState({
      image: e.target.files[0],
      position: { x: 0.5, y: 0.5 },
      errors: '',
    });
  };

  rotateLeft = (e) => {
    e.preventDefault();
    this.setState({ rotate: this.state.rotate - 90 });
  };

  rotateRight = (e) => {
    e.preventDefault();
    this.setState({ rotate: this.state.rotate + 90 });
  };

  handlePositionChange = (position) => {
    this.setState({ position });
  };

  updateAvatar = (e) => {
    const { t } = this.props;
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errors: ['reusable:errors:window-navigator'],
      });
    } else {
      if (this.state.image === '') {
        this.setState({
          loading: false,
          errors: ['AvatarUpdateForm:no-avatar-error'],
        });
      } else if (
        this.state.image.type !== 'image/jpeg' &&
        this.state.image.type !== 'image/jpg' &&
        this.state.image.type !== 'image/png' &&
        this.state.image.type !== 'image/gif'
      ) {
        this.setState({
          loading: false,
          errors: ['AvatarUpdateForm:file-type-error'],
        });
      } else {
        e.preventDefault();
        const lang = detectLanguage();
        this.setState({ loading: true });
        const img = this.editor.getImageScaledToCanvas().toDataURL();
        const path = `/api/v1/users/${this.props.userId}`;
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
            this.setState({ errors: '' });
            window.location.reload();
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              this.setState({
                loading: false,
                errors: ['reusable:errors:500'],
              });
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              this.setState({
                loading: false,
                errors: error.response.data.error,
              });
            }
          });
      }
    }
  };

  closeModal = () => {
    this.setState({
      errors: '',
      image: '',
    });
  };

  render() {
    const { t, tReady } = this.props;
    const noAvatar = `https://ui-avatars.com/api/?name=${this.props.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`;

    if (!tReady) return <Spinner />;

    return (
      <AvatarUpdateFormWrapper onClick={this.props.closeAllForms}>
        <Avatar data-cy='avatar' centered src={this.props.avatar === null ? noAvatar : this.props.avatar} />
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
          onClose={this.closeModal}
        >
          <Container space={2}>
            <ReactAvatarEditor
              ref={this.setEditorRef}
              width={258}
              height={258}
              position={this.state.position}
              onPositionChange={this.handlePositionChange}
              rotate={parseFloat(this.state.rotate)}
              borderRadius={129}
              image={this.state.image}
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
                  onChange={this.handleNewImage}
                  type='file'
                />
              </WithCursorPointer>
              <WithCursorPointer onClick={this.state.image !== '' ? this.rotateLeft : undefined}>
                <RotateLeft height={7} tint={this.state.image === '' ? 60 : 80} />
              </WithCursorPointer>
              <WithCursorPointer onClick={this.state.image !== '' ? this.rotateRight : undefined}>
                <RotateRight height={7} tint={this.state.image === '' ? 60 : 80} />
              </WithCursorPointer>
            </FlexWrapper>
            {this.state.errors.length > 0 && (
              <Notice data-cy='errors' nature='danger'>
                <Text bold centered size='sm'>
                  {t('reusable:errors.action-error-header')}
                </Text>
                <Text size='sm'>
                  <ul id='message-error-list'>
                    {this.state.errors.map((error) => (
                      <li key={error}>{t(error)}</li>
                    ))}
                  </ul>
                </Text>
              </Notice>
            )}
            <Button
              space={0}
              data-cy='save-avatar'
              disabled={this.state.loading}
              loading={this.state.loading}
              onClick={this.updateAvatar}
            >
              {t('reusable:cta:save')}
            </Button>
          </Container>
        </Popup>
      </AvatarUpdateFormWrapper>
    );
  }
}

export default withTranslation('AvatarUpdateForm')(AvatarUpdateForm);
