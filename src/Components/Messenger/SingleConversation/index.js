import { useState, useEffect, useRef } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import Cable from 'actioncable';
import TextareaAutosize from 'react-textarea-autosize';
import Popup from 'reactjs-popup';
import imagenation from 'imagenation';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { getAvatar } from '../../../Modules/getAvatar';
import withAuth from '../../../HOC/withAuth';

import Spinner from '../../../common/Spinner';

import { Flexbox, Notice, Header, Avatar } from '../../../UI-Components';
import { Arrow, Camera, Send, Trash } from '../../../icons';
import MessageBubble from './messageBubble';
import ImageUploadPopup from '../ImageUploadPopup';
import { StickyFooter, Inner, MaxWidh, StyledContentWrapper, StyledSecondaryStickyHeader } from './styles';

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
  const [imageUploadButton, setImageUploadButton] = useState(false);
  const [uploadedImage, setUploadedImage] = useState('');
  const [loadingUploadButton, setLoadingUploadButton] = useState(false);
  const [responder, setResponder] = useState({});

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

    if (newMessage.length < 1 || newMessage.length > 1000) {
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
        if (uploadedImage !== '') {
          channel.send({
            body: newMessage,
            image: uploadedImage,
            user_id: id,
            conversation_id: match.params.conversationId,
          });
          setNewMessage('');
          setLoadingUploadButton(true);
        } else {
          channel.send({
            body: newMessage,
            image: uploadedImage,
            user_id: id,
            conversation_id: match.params.conversationId,
          });
          setNewMessage('');
        }
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

  const clearImage = () => {
    setImageUploadButton(true);
    setUploadedImage('');
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

  const onImageDropHandler = async (pictureFiles) => {
    if (pictureFiles.length > 0) {
      setImageUploadButton(false);
      setUploadedImage([await imagenation(pictureFiles[0], 750)]);
    } else {
      clearImage();
    }
  };

  const onMessageType = (e) => {
    setNewMessage(e.target.value);
    setErrors([]);
  };

  if (!ready || loading) return <Spinner />;

  return (
    <>
      <Popup
        modal
        open={imageUploadPopupOpen}
        closeOnDocumentClick={!loadingUploadButton}
        onClose={() => {
          setImageUploadPopupOpen(false);
          setUploadedImage('');
          setImageUploadButton(true);
        }}
        position='top center'
      >
        <div>
          <ImageUploadPopup
            onImageDropHandler={onImageDropHandler}
            imageUploadButton={imageUploadButton}
            handleSendEvent={handleSendEvent}
            uploadedImage={uploadedImage}
            loadingUploadButton={loadingUploadButton}
            clearImage={clearImage}
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
      <StyledContentWrapper top={88} noBottomPadding>
        {messagesHistory.length > 0 &&
          messagesHistory.map((message) => {
            return (
              <div key={message.id}>
                <MessageBubble
                  lang={lang}
                  message={message}
                  scrollDown={scrollDown}
                  belongsToCurrent={username === message.user.nickname}
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
                  belongsToCurrent={username === message.user.nickname}
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
        {!responder && <div>this user exist no more</div>}
        <div ref={bottomOfPage} style={{ height: '1px' }}></div>
      </StyledContentWrapper>
      <StickyFooter>
        <Inner>
          <TextareaAutosize
            minRows={1}
            maxRows={4}
            className='expanding-textarea'
            placeholder={t('SingleConversation:textarea-plch')}
            value={newMessage}
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

  // if (ready && loading === false) {
  //   let messageLength = 1000 - newMessage.length;

  //   return (
  //     <>
  //       <Popup
  //         modal
  //         open={imageUploadPopupOpen}
  //         closeOnDocumentClick={!loadingUploadButton}
  //         onClose={() => {
  //           setImageUploadPopupOpen(false);
  //           setUploadedImage('');
  //           setImageUploadButton(true);
  //         }}
  //         position='top center'
  //       >
  //         <div>
  //           <ImageUploadPopup
  //             onImageDropHandler={onImageDropHandler}
  //             imageUploadButton={imageUploadButton}
  //             handleSendEvent={handleSendEvent}
  //             uploadedImage={uploadedImage}
  //             loadingUploadButton={loadingUploadButton}
  //             clearImage={clearImage}
  //           />
  //         </div>
  //       </Popup>
  //       <div
  //         id='secondary-sticky'
  //         style={{
  //           height: '80px',
  //           display: 'flex',
  //           flexDirection: 'column',
  //           justifyContent: 'center',
  //           ...secondaryStickyStyle,
  //         }}
  //       >
  //         <div className='max-width-wrapper' style={{ display: 'flex', alignItems: 'center' }}>
  //           <Icon
  //             name='arrow left'
  //             size='large'
  //             style={{ color: '#c90c61', cursor: 'pointer' }}
  //             onClick={() => {
  //               history.push('/messenger');
  //             }}
  //           />
  //           <div
  //             style={{
  //               display: 'flex',
  //               margin: 'auto',
  //               cursor: state.user.id !== null && 'pointer',
  //             }}
  //             onClick={() => {
  //               state.user.id !== null &&
  //                 history.push({
  //                   pathname: '/host-profile',
  //                   state: {
  //                     userId: state.user.id,
  //                     avatar: state.user.profile_avatar,
  //                     nickname: state.user.nickname,
  //                     location: state.user.location,
  //                     errors: '',
  //                     noMessage: true,
  //                   },
  //                 });
  //             }}
  //           >
  //             <Image
  //               src={
  //                 state.user.profile_avatar === null
  //                   ? `https://ui-avatars.com/api/?name=${
  //                       state.user.nickname === 'Deleted user' ? '[x]' : state.user.nickname
  //                     }&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
  //                   : state.user.profile_avatar
  //               }
  //               size='mini'
  //               style={{ borderRadius: '50%', height: '2rem', width: '2rem', marginTop: '0', marginRight: '1rem' }}
  //             />
  //             <Header as='h2' style={{ marginTop: '0' }}>
  //               {state.user.nickname}
  //             </Header>
  //           </div>
  //           <Icon
  //             id='delete-conversation'
  //             name='trash alternate outline'
  //             size='large'
  //             style={{ color: '#c90c61', cursor: 'pointer' }}
  //             onClick={deleteConversation}
  //           />
  //         </div>
  //       </div>
  //       <div
  //         className='messenger-wrapper single-conversation'
  //         style={{
  //           overflow: 'scroll',
  //           marginBottom: parseInt(footerHeight) === 38 ? '80px' : `${30 + parseInt(footerHeight)}px`,
  //           height: `calc(var(--vh, 1vh) * 100 - var(--nav) - ${
  //             parseInt(footerHeight) === 38 ? '80px' : `${30 + parseInt(footerHeight)}px`
  //           })`,
  //         }}
  //         onScroll={handleScroll}
  //       >
  //         <div className='single-conversation-wrapper' style={{ paddingTop: '80px' }}>
  //           <div style={{ height: '1rem' }}></div>
  //           {messagesHistory.length < 1 && chatLogs.length < 1 && errors.length < 1 && (
  //             <p style={{ textAlign: 'center', fontStyle: 'italic' }}>{t('SingleConversation:no-messages-yet')}</p>
  //           )}
  //           {messagesHistory.length > 0 &&
  //             messagesHistory.map((message) => {
  //               return (
  //                 <div key={message.id}>
  //                   <MessageBubble
  //                     currentUsername={username}
  //                     currentAvatar={avatar}
  //                     otherAvatar={state.user.profile_avatar}
  //                     message={message}
  //                     scrollDown={scrollDown}
  //                   />
  //                 </div>
  //               );
  //             })}
  //           {chatLogs.length > 0 &&
  //             chatLogs.map((message) => {
  //               return (
  //                 <div key={message.id}>
  //                   <MessageBubble
  //                     currentUsername={username}
  //                     currentAvatar={avatar}
  //                     otherAvatar={state.user.profile_avatar}
  //                     message={message}
  //                     scrollDown={scrollDown}
  //                   />
  //                 </div>
  //               );
  //             })}
  //           {errors.length > 0 && (
  //             <Message negative style={{ width: 'inherit' }}>
  //               <Message.Header style={{ textAlign: 'center' }}>
  //                 {t('SingleConversation:error-message-header')}
  //               </Message.Header>
  //               <ul id='message-error-list'>
  //                 {errors.map((error) => (
  //                   <li key={error}>{t(error)}</li>
  //                 ))}
  //               </ul>
  //             </Message>
  //           )}
  //         </div>
  //         <div ref={bottomOfPage} style={{ height: '1px' }}></div>
  //       </div>
  // <div
  //   style={{
  //     minHeight: '80px',
  //     width: '100%',
  //     position: 'fixed',
  //     bottom: '0',
  //     background: 'white',
  //     zIndex: '100',
  //     boxShadow: '0 0 20px -5px rgba(0,0,0,.2)',
  //     paddingTop: '1rem',
  //   }}
  // >
  //   <div className='single-conversation-wrapper'>
  //     <div style={{ display: 'inline-flex', width: '100%' }}>
  //       <Icon
  //         id='upload-image'
  //         name='photo'
  //         size='big'
  //         style={{
  //           display: (state.user.id === null || newMessage.length > 0) && 'none',
  //           cursor: 'pointer',
  //           color: '#d8d8d8',
  //           fontSize: '2.5em',
  //           marginRight: '0.5rem',
  //           alignSelf: 'flex-end',
  //         }}
  //         onClick={() => {
  //           setImageUploadPopupOpen(true);
  //         }}
  //       />
  //       <div
  //         style={{
  //           width: '100%',
  //           alignSelf: 'flex-end',
  //           minHeight: '2.5em',
  //           position: 'relative',
  //           bottom: '0px',
  //           display: 'flex',
  //           flexDirection: 'column-reverse',
  //           height: footerHeight,
  //         }}
  //       >
  //         <TextareaAutosize
  //           minRows={1}
  //           maxRows={6}
  //           className='expanding-textarea disable-scrollbars'
  //           placeholder={t('SingleConversation:textarea-plch')}
  //           id='newMessage'
  //           value={newMessage}
  //           onChange={onMessageType}
  //           onKeyPress={listenEnterKeyMessage}
  //           onHeightChange={(height) => setFooterHeight(`${height}px`)}
  //           disabled={state.user.id === null && true}
  //           style={{ paddingRight: '40px' }}
  //         />
  //         <div
  //           style={{
  //             display: newMessage === '' ? 'none' : 'block',
  //             zIndex: '4000',
  //             alignSelf: 'flex-end',
  //             marginBottom: '0.6rem',
  //             marginRight: '0.5rem',
  //             background: 'white',
  //             paddingLeft: '0.5rem',
  //             paddingTop: '0.4rem',
  //           }}
  //         >
  //           <Icon
  //             id='send'
  //             name='arrow alternate circle up'
  //             link
  //             size='large'
  //             onClick={(e) => handleSendEvent(e)}
  //             style={{ color: '#c90c61' }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <p
  //       style={{
  //         textAlign: 'end',
  //         fontSize: 'smaller',
  //         fontStyle: 'italic',
  //         visibility: messageLength < 100 ? 'visible' : 'hidden',
  //       }}
  //     >
  //       {t('reusable:remaining-chars')} {messageLength}
  //     </p>
  //   </div>
  // </div>
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

const mapStateToProps = (state) => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
});

export default connect(mapStateToProps)(withAuth(Conversation));
