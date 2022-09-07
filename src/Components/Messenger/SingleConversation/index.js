import { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import Cable from 'actioncable';
import TextareaAutosize from 'react-textarea-autosize';
import Popup from 'reactjs-popup';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { getAvatar } from '../../../Modules/getAvatar';
import withAuth from '../../../HOC/withAuth';

import Spinner from '../../../common/Spinner';

import { Flexbox, Notice, Header, Avatar } from '../../../UI-Components';
import { Arrow, Camera, Send, Trash } from '../../../icons';
import MessageBubble from './messageBubble';
import ImageUploadPopup from './imageUploadPopup';
import {
  StickyFooter,
  Inner,
  MaxWidh,
  ConversationWrapper,
  StyledSecondaryStickyHeader,
  MessagesWrapper,
} from './styles';
import Helmet from 'react-helmet';

const Conversation = ({ id, username, match, history }) => {
  const { t, ready } = useTranslation('SingleConversation');
  const lang = detectLanguage();
  const bottomOfPage = useRef(null);

  const [newMessage, setNewMessage] = useState('');
  const [chatLogs, setChatLogs] = useState([]);
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [channel, setChannel] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUploadPopupOpen, setImageUploadPopupOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');
  const [loadingUploadButton, setLoadingUploadButton] = useState(false);
  const [responder, setResponder] = useState({});
  const [textAreaFocused, setTextAreaFocused] = useState(false)

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      return setErrors(['reusable:errors:window-navigator']);
    }

    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };

    const pathCable =
      process.env.NODE_ENV === 'development' ? 'ws://localhost:3007' : process.env.REACT_APP_API_ENDPOINT;
    const cable = Cable.createConsumer(
      `${pathCable}/api/v1/cable/conversation/${match.params.conversationId}?token=${headers['access-token']}&uid=${headers.uid}&client=${headers.client}&locale=${lang}`
    );

    const channelToSave = cable.subscriptions.create(
      {
        channel: 'ConversationsChannel',
        conversations_id: match.params.conversationId,
      },
      {
        connected: () => {},
        received: (data) => {
          setChatLogs((prev) => [...prev, data.message]);
          bottomOfPage.current?.scrollIntoView({ behavior: 'smooth' });
        },
      }
    );

    setChannel(channelToSave);

    const path = `/api/v1/conversations/${match.params.conversationId}?locale=${lang}`;

    axios
      .get(path, { headers: headers })
      .then((response) => {
        setResponder(response.data.responder);
        setMessagesHistory(response.data.message.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
      })
      .catch(({ response }) => {
        if (response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([response.data.error]);
        }
      })
      .finally(() => {
        setLoading(false);
        bottomOfPage.current?.scrollIntoView({ behavior: 'smooth' });
      });

    return () => {
      channelToSave.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollDown();
  }, [errors]);

  const handleSendEvent = (event) => {
    event.preventDefault();

    const email = new RegExp(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i);
    const phone = new RegExp(/(([+]46)\s*(7)|07)[02369]\s*(\d{4})\s*(\d{3})/);

    if (window.navigator.onLine === false) {
      setImageUploadPopupOpen(false);
      return setErrors(['reusable:errors:window-navigator']);
    }

    if ((newMessage.length < 1 || newMessage.length > 1000) && !uploadedImage) {
      return setErrors(['SingleConversation:message-body-error']);
    }

    if (email.test(newMessage) || phone.test(newMessage)) {
      return setErrors(['SingleConversation:email-phone-error']);
    }

    const path = '/api/v1/auth/validate_token';
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };

    axios
      .get(path, { headers: headers })
      .then(() => {
        channel.send({
          body: newMessage,
          image: uploadedImage === '' ? '' : [uploadedImage],
          user_id: id,
          conversation_id: match.params.conversationId,
        });
        setNewMessage('');
        uploadedImage !== '' && setLoadingUploadButton(true);
      })
      .catch(({ response }) => {
        if (response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
        } else if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([response.data.error]);
        }
      });
  };

  const scrollDown = () => {
    setImageUploadPopupOpen(false);
    setLoadingUploadButton(false);
    bottomOfPage.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const deleteConversation = () => {
    if (window.navigator.onLine === false) {
      return setErrors(['reusable:errors:window-navigator']);
    }
    if (window.confirm(t('SingleConversation:del-conversation'))) {
      const path = `/api/v1/conversations/${match.params.conversationId}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const payload = {
        hidden: id,
        locale: lang,
      };
      axios
        .patch(path, payload, { headers: headers })
        .then(() => {
          window.location.replace('/messenger');
        })
        .catch(({ response }) => {
          if (response === undefined) {
            setErrors(['reusable:errors.unknown']);
          } else if (response.status === 500) {
            setErrors(['reusable:errors:500']);
          } else if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            setErrors(response.data.error);
          }
        });
    }
  };

  const onMessageType = (e) => {
    setNewMessage(e.target.value);
    setErrors([]);
  };

  if (!ready || loading) return <Spinner />;

  return (
    <>
      <Helmet
        bodyAttributes={{
          class: textAreaFocused ? 'overflow-hidden' : 'overflow-auto',
        }}
      />
      <Popup
        modal
        open={imageUploadPopupOpen}
        closeOnDocumentClick={!loadingUploadButton}
        onClose={() => {
          setImageUploadPopupOpen(false);
          setUploadedImage('');
        }}
        position='top center'
      >
        <div>
          <ImageUploadPopup
            t={t}
            onImageChange={(image) => setUploadedImage(image)}
            handleSendEvent={handleSendEvent}
            uploadedImage={uploadedImage}
            loadingUploadButton={loadingUploadButton}
            clearImage={() => setUploadedImage('')}
          />
        </div>
      </Popup>
      <StyledSecondaryStickyHeader>
        <MaxWidh>
          <Arrow onClick={() => history.push('/messenger')} height={5} direction='left' tint={60} />
          <Flexbox spaceItemsX={1} onClick={() => console.log('i will eventually go to host profile')}>
            <Avatar src={responder?.profile_avatar || getAvatar(responder?.nickname)} size={'sm'} />
            <Header level={3}>{responder?.nickname || t('SingleConversation:nickname-deleted')}</Header>
          </Flexbox>
          <Trash onClick={() => deleteConversation()} height={5} tint={60} />
        </MaxWidh>
      </StyledSecondaryStickyHeader>
      <ConversationWrapper noBottomPadding>
        <MessagesWrapper>
          {messagesHistory.length > 0 &&
            messagesHistory.map((message) => {
              return (
                <div key={message.id}>
                  <MessageBubble
                    lang={lang}
                    message={message}
                    scrollDown={scrollDown}
                    belongsToCurrent={username === message.user?.nickname}
                  />
                </div>
              );
            })}
          {chatLogs.length > 0 &&
            chatLogs.map((message) => {
              return (
                <div key={message.id}>
                  <MessageBubble
                    lang={lang}
                    message={message}
                    scrollDown={scrollDown}
                    belongsToCurrent={username === message.user?.nickname}
                  />
                </div>
              );
            })}
          {errors.length > 0 && (
            <Notice nature='danger'>
              <Header centered level={5}>
                {t('SingleConversation:error-message-header')}
              </Header>
              <ul id='message-error-list'>
                {errors.map((error) => (
                  <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
                ))}
              </ul>
            </Notice>
          )}
          {!responder && <div>{t('SingleConversation:deleted-user')}</div>}
          <div ref={bottomOfPage} style={{ height: '1px' }}></div>
        </MessagesWrapper>
      </ConversationWrapper>
      <StickyFooter>
        <Inner>
          <TextareaAutosize
            minRows={1}
            maxRows={4}
            className='expanding-textarea'
            placeholder={t('SingleConversation:textarea-plch')}
            value={newMessage}
            onFocus={() => setTextAreaFocused(true)}
            onBlur={() => setTextAreaFocused(false)}
            onHeightChange={() => scrollDown()}
            onChange={onMessageType}
            onKeyPress={(e) => e.key === 'Enter' && handleSendEvent(e)}
            disabled={!responder}
            style={{ paddingRight: '40px' }}
          />
          {newMessage ? (
            <Send height={6} fill='primary' onClick={(e) => handleSendEvent(e)} />
          ) : (
            <Camera height={6} tint={60} onClick={() => responder && setImageUploadPopupOpen(true)} />
          )}
        </Inner>
      </StickyFooter>
    </>
  );
};

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
});

export default connect(mapStateToProps)(withAuth(Conversation));
