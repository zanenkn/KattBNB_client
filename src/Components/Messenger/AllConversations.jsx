import React, { useState, useEffect } from 'react';
import withAuth from '../../HOC/withAuth';
import Spinner from '../ReusableComponents/Spinner';
import { connect } from 'react-redux';
import { Image, Header, Grid, Divider, Message } from 'semantic-ui-react';
import timeFormat from '../../Modules/dateFormatting';
import moment from 'moment';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';

const AllConversations = ({ id, history }) => {
  const { t, ready } = useTranslation('AllConversations');

  const [conversations, setConversations] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [secondaryStickyStyle, setSecondaryStickyStyle] = useState({
    boxShadow: 'none',
    borderBottom: '1px solid rgba(34,36,38,.15)',
  });

  const handleAxiosStateChanges = (loadingState, errorMessage) => {
    setLoading(loadingState);
    setErrors(errorMessage);
  };

  useEffect(() => {
    if (window.navigator.onLine === false) {
      handleAxiosStateChanges(false, ['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const path = `/api/v1/conversations?user_id=${id}&locale=${lang}`;
      axios
        .get(path, { headers: headers })
        .then(({ data }) => {
          const shownConversations = [];
          data.map((conversation) => {
            if (conversation.hidden !== id) {
              shownConversations.push(conversation);
            }
            return null;
          });
          const sortedResponse = shownConversations.sort(function (a, b) {
            let dateA = new Date(a.msg_created),
              dateB = new Date(b.msg_created);
            return dateB - dateA;
          });
          setConversations(sortedResponse);
          handleAxiosStateChanges(false, []);
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            handleAxiosStateChanges(false, ['reusable:errors:500']);
          } else if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            handleAxiosStateChanges(false, response.data.error);
          }
        });
    }
    // eslint-disable-next-line
  }, []);

  const handleScroll = (e) => {
    let newSecondaryStickyStyle =
      e.target.scrollTop > 0
        ? { boxShadow: '0 0 20px -5px rgba(0,0,0,.2)', borderBottom: 'none' }
        : { boxShadow: 'none', borderBottom: '1px solid rgba(34,36,38,.15)' };
    setSecondaryStickyStyle(newSecondaryStickyStyle);
  };

  if (ready) {
    const lang = detectLanguage();
    let deleted_user = {
      nickname: t('AllConversations:deleted-user'),
      profile_avatar: null,
      location: 'none',
      id: null,
    };
    moment.locale(lang);

    if (loading) {
      return <Spinner />;
    } else if (errors.length > 0) {
      return (
        <div className='content-wrapper'>
          <Message negative>
            <ul id='message-error-list'>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        </div>
      );
    } else {
      return (
        <>
          <div
            id='secondary-sticky'
            style={{
              height: '80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              ...secondaryStickyStyle,
            }}
          >
            <Header as='h1'>{t('AllConversations:header')}</Header>
          </div>
          <div className='messenger-wrapper all-conversations' style={{ paddingTop: '96px' }} onScroll={handleScroll}>
            {conversations.length < 1 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic' }}>{t('AllConversations:no-messages')}</p>
            ) : (
              conversations.map((conversation) => {
                let other_user, time_format;
                conversation.user1 === null
                  ? (other_user = deleted_user)
                  : conversation.user2 === null
                  ? (other_user = deleted_user)
                  : conversation.user1.id === id
                  ? (other_user = conversation.user2)
                  : (other_user = conversation.user1);
                time_format = timeFormat(conversation.msg_created);
                return (
                  <div
                    key={conversation.id}
                    id={conversation.id}
                    data-cy='all-messages'
                    onClick={() => {
                      history.push({
                        pathname: '/conversation',
                        state: {
                          id: conversation.id,
                          user: other_user === null ? deleted_user : other_user,
                        },
                      });
                    }}
                  >
                    <Grid className='conversation-index-wrapper'>
                      <Grid.Column width={4} style={{ display: 'grid', alignContent: 'center', paddingLeft: '1.5rem' }}>
                        {other_user.id === null ? (
                          <Image
                            src={`https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`}
                            size='mini'
                            style={{
                              borderRadius: '50%',
                              margin: 'auto auto auto 0',
                              maxWidth: '50px',
                              width: '-webkit-fill-available',
                            }}
                          ></Image>
                        ) : (
                          <Image
                            src={
                              other_user.profile_avatar === null
                                ? `https://ui-avatars.com/api/?name=${other_user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
                                : other_user.profile_avatar
                            }
                            size='mini'
                            style={{
                              borderRadius: '50%',
                              margin: 'auto auto auto 0',
                              maxWidth: '50px',
                              width: '-webkit-fill-available',
                            }}
                          ></Image>
                        )}
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <p style={{ marginBottom: '0', color: '#c90c61' }}>
                          <strong>{other_user.nickname}</strong>
                        </p>
                        <p
                          style={{ whiteSpace: 'nowrap', height: '2rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {conversation.msg_body === null ? '' : conversation.msg_body}
                        </p>
                      </Grid.Column>
                      <Grid.Column width={4} style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                        <p style={{ fontSize: 'small' }}>
                          {conversation.msg_created === null
                            ? t('AllConversations:no-messages-2')
                            : moment(conversation.msg_created).format(time_format)}
                        </p>
                      </Grid.Column>
                    </Grid>
                    <Divider />
                  </div>
                );
              })
            )}
          </div>
        </>
      );
    }
  } else {
    return <Spinner />;
  }
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(withAuth(AllConversations));
