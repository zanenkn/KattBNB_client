import React, { Component } from 'react';
import withAuth from '../../HOC/withAuth';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { connect } from 'react-redux';
import Spinner from '../ReusableComponents/Spinner';
import MessageBubble from '../ReusableComponents/MessageBubble';
import { Icon, Message, Header, Image } from 'semantic-ui-react';
import Cable from 'actioncable';
import TextareaAutosize from 'react-textarea-autosize';
import Popup from 'reactjs-popup';
import ImageUploadPopup from './ImageUploadPopup';
import imagenation from 'imagenation';
import { withTranslation } from 'react-i18next';

class Conversation extends Component {
  state = {
    newMessage: '',
    chatLogs: [],
    messagesHistory: [],
    errorDisplay: false,
    errors: '',
    scrollYPosition: 0,
    loading: true,
    footerHeight: '38px',
    imageUploadPopupOpen: false,
    imageUploadButton: true,
    uploadedImage: '',
    loadingUploadButton: false,
    secondaryStickyStyle: { boxShadow: 'none', borderBottom: '1px solid rgba(34,36,38,.15)' },
  };

  componentDidMount() {
    const { t } = this.props;
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator'],
      });
    } else if (window.history.state === null) {
      window.location.replace('/messenger');
    } else {
      const lang = detectLanguage();
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const path = `/api/v1/conversations/${this.props.location.state.id}?locale=${lang}`;
      axios
        .get(path, { headers: headers })
        .then((response) => {
          const sortedResponse = response.data.message.sort(function (a, b) {
            let dateA = new Date(a.created_at),
              dateB = new Date(b.created_at);
            return dateA - dateB;
          });
          this.setState({
            messagesHistory: sortedResponse,
            loading: false,
            errorDisplay: false,
            errors: '',
          });
          typeof this.bottom !== 'undefined' && this.bottom.scrollIntoView({ behavior: 'smooth' });
        })
        .catch((error) => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 500) {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: ['reusable:errors:500'],
            });
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            this.setState({
              loading: false,
              errorDisplay: true,
              errors: error.response.data.error,
            });
          }
        });
    }
  }

  scrollDown = () => {
    typeof this.bottom !== 'undefined' && this.bottom.scrollIntoView({ behavior: 'smooth' });
    this.setState({
      imageUploadPopupOpen: false,
      loadingUploadButton: false,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    let secondaryStickyStyle =
      e.target.scrollTop > 0
        ? { boxShadow: '0 0 20px -5px rgba(0,0,0,.2)', borderBottom: 'none' }
        : { boxShadow: 'none', borderBottom: '1px solid rgba(34,36,38,.15)' };

    this.setState({
      secondaryStickyStyle: secondaryStickyStyle,
    });
  };

  listenEnterKeyMessage = (event) => {
    if (event.key === 'Enter') {
      this.handleSendEvent(event);
    }
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      errorDisplay: false,
      errors: '',
    });
  };

  async handleError(errors) {
    await this.setState({
      errors: errors,
      errorDisplay: true,
    });
    typeof this.bottom !== 'undefined' && this.bottom.scrollIntoView({ behavior: 'smooth' });
  }

  handleSendEvent(event) {
    event.preventDefault();
    const { t } = this.props;
    if (window.navigator.onLine === false) {
      this.setState({ imageUploadPopupOpen: false });
      this.handleError(['reusable:errors:window-navigator']);
    } else {
      const path = '/api/v1/auth/validate_token';
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      axios
        .get(path, { headers: headers })
        .then(() => {
          if (this.state.uploadedImage !== '') {
            this.chats.create(
              this.state.newMessage,
              this.state.uploadedImage,
              this.props.location.state.id,
              this.props.id
            );
            this.setState({
              newMessage: '',
              loadingUploadButton: true,
            });
          } else if (this.state.newMessage.length < 1 || this.state.newMessage.length > 1000) {
            this.handleError(['SingleConversation:message-body-error']);
          } else {
            this.chats.create(
              this.state.newMessage,
              this.state.uploadedImage,
              this.props.location.state.id,
              this.props.id
            );
            this.setState({ newMessage: '' });
          }
        })
        .catch((error) => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 500) {
            this.handleError(['reusable:errors:500']);
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            this.handleError(error.response.data.error);
          }
        });
    }
  }

  createSocket() {
    let uid = window.localStorage.getItem('uid');
    let client = window.localStorage.getItem('client');
    let token = window.localStorage.getItem('access-token');
    const lang = detectLanguage();
    let path = process.env.NODE_ENV === 'development' ? 'ws://localhost:3007' : process.env.REACT_APP_API_ENDPOINT;
    let cable = Cable.createConsumer(
      `${path}/api/v1/cable/conversation/${this.props.location.state.id}?token=${token}&uid=${uid}&client=${client}&locale=${lang}`
    );
    this.chats = cable.subscriptions.create(
      {
        channel: 'ConversationsChannel',
        conversations_id: this.props.location.state.id,
      },
      {
        connected: () => {},
        received: (data) => {
          let chatLogs = this.state.chatLogs;
          chatLogs.push(data.message);
          this.setState({ chatLogs: chatLogs });
          typeof this.bottom !== 'undefined' && this.bottom.scrollIntoView({ behavior: 'smooth' });
        },
        create: function (msg, img, conv_id, user_id) {
          this.perform('send_message', {
            body: msg,
            image: img,
            user_id: user_id,
            conversation_id: conv_id,
          });
        },
      }
    );
  }

  clearImage = () => {
    this.setState({
      imageUploadButton: true,
      uploadedImage: '',
    });
  };

  deleteConversation = () => {
    const { t } = this.props;
    const lang = detectLanguage();
    this.setState({ loading: true });
    if (window.navigator.onLine === false) {
      this.setState({
        loading: false,
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator'],
      });
    } else {
      if (window.confirm(t('SingleConversation:del-conversation'))) {
        const path = `/api/v1/conversations/${this.props.location.state.id}`;
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        const payload = {
          hidden: this.props.id,
          locale: lang,
        };
        axios
          .patch(path, payload, { headers: headers })
          .then(() => {
            window.location.replace('/messenger');
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: ['reusable:errors:500'],
              });
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: error.response.data.error,
              });
            }
          });
      } else {
        this.setState({ loading: false });
      }
    }
  };

  onImageDropHandler = async (pictureFiles) => {
    if (pictureFiles.length > 0) {
      this.setState({
        imageUploadButton: false,
        uploadedImage: [await imagenation(pictureFiles[0], 750)],
      });
    } else {
      this.clearImage();
    }
  };

  componentWillMount() {
    if (window.history.state === null) {
      window.location.replace('/messenger');
    } else {
      this.createSocket();
    }
  }

  render() {
    const { t } = this.props;
    let messageLength = 1000 - this.state.newMessage.length;

    if (this.state.loading) {
      return <Spinner />;
    } else {
      return (
        <>
          <Popup
            modal
            open={this.state.imageUploadPopupOpen}
            closeOnDocumentClick={!this.state.loadingUploadButton}
            onClose={() => {
              this.setState({ imageUploadPopupOpen: false, uploadedImage: '', imageUploadButton: true });
            }}
            position='top center'
          >
            <div>
              <ImageUploadPopup
                onImageDropHandler={this.onImageDropHandler.bind(this)}
                imageUploadButton={this.state.imageUploadButton}
                handleSendEvent={this.handleSendEvent.bind(this)}
                uploadedImage={this.state.uploadedImage}
                loadingUploadButton={this.state.loadingUploadButton}
                clearImage={this.clearImage}
              />
            </div>
          </Popup>
          <div
            id='secondary-sticky'
            style={{
              height: '80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ...this.state.secondaryStickyStyle,
            }}
          >
            <div className='max-width-wrapper' style={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                name='arrow left'
                size='large'
                style={{ color: '#c90c61', cursor: 'pointer' }}
                onClick={() => {
                  this.props.history.push('/messenger');
                }}
              />
              <div
                style={{
                  display: 'flex',
                  margin: 'auto',
                  cursor: this.props.location.state.user.id !== null && 'pointer',
                }}
                onClick={() => {
                  this.props.location.state.user.id !== null &&
                    this.props.history.push({
                      pathname: '/host-profile',
                      state: {
                        userId: this.props.location.state.user.id,
                        avatar: this.props.location.state.user.profile_avatar,
                        nickname: this.props.location.state.user.nickname,
                        location: this.props.location.state.user.location,
                        errors: '',
                        noMessage: true,
                      },
                    });
                }}
              >
                <Image
                  src={
                    this.props.location.state.user.profile_avatar === null
                      ? `https://ui-avatars.com/api/?name=${
                          this.props.location.state.user.nickname === 'Deleted user'
                            ? '[x]'
                            : this.props.location.state.user.nickname
                        }&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
                      : this.props.location.state.user.profile_avatar
                  }
                  size='mini'
                  style={{ borderRadius: '50%', height: '2rem', width: '2rem', marginTop: '0', marginRight: '1rem' }}
                />

                <Header as='h2' style={{ marginTop: '0' }}>
                  {this.props.location.state.user.nickname}
                </Header>
              </div>
              <Icon
                id='delete-conversation'
                name='trash alternate outline'
                size='large'
                style={{ color: '#c90c61', cursor: 'pointer' }}
                onClick={this.deleteConversation}
              />
            </div>
          </div>
          <div
            className='messenger-wrapper single-conversation'
            style={{
              overflow: 'scroll',
              marginBottom:
                parseInt(this.state.footerHeight) === 38 ? '80px' : `${30 + parseInt(this.state.footerHeight)}px`,
              height: `calc(var(--vh, 1vh) * 100 - var(--nav) - ${
                parseInt(this.state.footerHeight) === 38 ? '80px' : `${30 + parseInt(this.state.footerHeight)}px`
              })`,
            }}
            onScroll={this.handleScroll}
          >
            <div className='single-conversation-wrapper' style={{ paddingTop: '80px' }}>
              <div style={{ height: '1rem' }}></div>
              {this.state.messagesHistory.length < 1 &&
                this.state.chatLogs.length < 1 &&
                this.state.errorDisplay === false && (
                  <p style={{ textAlign: 'center', fontStyle: 'italic' }}>{t('SingleConversation:no-messages-yet')}</p>
                )}
              {this.state.messagesHistory.length > 0 &&
                this.state.messagesHistory.map((message) => {
                  return (
                    <div key={message.id}>
                      <MessageBubble
                        currentUsername={this.props.username}
                        currentAvatar={this.props.avatar}
                        otherAvatar={this.props.location.state.user.profile_avatar}
                        message={message}
                        scrollDown={this.scrollDown.bind(this)}
                      />
                    </div>
                  );
                })}
              {this.state.chatLogs.length > 0 &&
                this.state.chatLogs.map((message) => {
                  return (
                    <div key={message.id}>
                      <MessageBubble
                        currentUsername={this.props.username}
                        currentAvatar={this.props.avatar}
                        otherAvatar={this.props.location.state.user.profile_avatar}
                        message={message}
                        scrollDown={this.scrollDown.bind(this)}
                      />
                    </div>
                  );
                })}
              {this.state.errorDisplay && (
                <Message negative style={{ width: 'inherit' }}>
                  <Message.Header style={{ textAlign: 'center' }}>
                    {t('SingleConversation:error-message-header')}
                  </Message.Header>
                  <ul id='message-error-list'>
                    {this.state.errors.map((error) => (
                      <li key={error}>{t(error)}</li>
                    ))}
                  </ul>
                </Message>
              )}
            </div>
            <div
              ref={(el) => {
                this.bottom = el;
              }}
              style={{ height: '1px' }}
            ></div>
          </div>
          <div
            style={{
              minHeight: '80px',
              width: '100%',
              position: 'fixed',
              bottom: '0',
              background: 'white',
              zIndex: '100',
              boxShadow: '0 0 20px -5px rgba(0,0,0,.2)',
              paddingTop: '1rem',
            }}
          >
            <div className='single-conversation-wrapper'>
              <div style={{ display: 'inline-flex', width: '100%' }}>
                <Icon
                  id='upload-image'
                  name='photo'
                  size='big'
                  style={{
                    display: (this.props.location.state.user.id === null || this.state.newMessage.length > 0) && 'none',
                    cursor: 'pointer',
                    color: '#d8d8d8',
                    fontSize: '2.5em',
                    marginRight: '0.5rem',
                    alignSelf: 'flex-end',
                  }}
                  onClick={() => {
                    this.setState({ imageUploadPopupOpen: true });
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    alignSelf: 'flex-end',
                    minHeight: '2.5em',
                    position: 'relative',
                    bottom: '0px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    height: this.state.footerHeight,
                  }}
                >
                  <TextareaAutosize
                    minRows={1}
                    maxRows={6}
                    className='expanding-textarea disable-scrollbars'
                    placeholder={t('SingleConversation:textarea-plch')}
                    id='newMessage'
                    value={this.state.newMessage}
                    onChange={this.onChangeHandler}
                    onKeyPress={this.listenEnterKeyMessage}
                    onHeightChange={(height) => this.setState({ footerHeight: `${height}px` })}
                    disabled={this.props.location.state.user.id === null && true}
                    style={{ paddingRight: '40px' }}
                  />
                  <div
                    style={{
                      display: this.state.newMessage === '' ? 'none' : 'block',
                      zIndex: '4000',
                      alignSelf: 'flex-end',
                      marginBottom: '0.6rem',
                      marginRight: '0.5rem',
                      background: 'white',
                      paddingLeft: '0.5rem',
                      paddingTop: '0.4rem',
                    }}
                  >
                    <Icon
                      id='send'
                      name='arrow alternate circle up'
                      link
                      size='large'
                      onClick={(e) => this.handleSendEvent(e)}
                      style={{ color: '#c90c61' }}
                    />
                  </div>
                </div>
              </div>
              <p
                style={{
                  textAlign: 'end',
                  fontSize: 'smaller',
                  fontStyle: 'italic',
                  visibility: messageLength < 100 ? 'visible' : 'hidden',
                }}
              >
                {t('reusable:remaining-chars')} {messageLength}
              </p>
            </div>
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
});

export default withTranslation('SingleConversation')(connect(mapStateToProps)(withAuth(Conversation)));
