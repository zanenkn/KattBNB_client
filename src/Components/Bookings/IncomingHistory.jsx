import React, { useState } from 'react';
import moment from 'moment';
import { Container, Message } from 'semantic-ui-react';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import Popup from 'reactjs-popup';
import IncRequestDeclinedPopup from './IncRequestDeclinedPopup';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { withRouter } from 'react-router-dom';
import ViewReviewPopup from '../Reviews/ViewReviewPopup';

const IncomingHistory = (props) => {
  const { t, ready } = useTranslation('IncomingHistory');

  const [errors, setErrors] = useState([]);

  const messageUser = (e, hostId, userId, userAvatar, userLocation, userNickname) => {
    e.preventDefault();
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
      const path = '/api/v1/conversations';
      const payload = {
        user1_id: hostId,
        user2_id: userId,
        locale: lang,
      };
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      axios
        .post(path, payload, { headers: headers })
        .then((response) => {
          props.history.push({
            pathname: '/conversation',
            state: {
              id: response.data.id,
              user: {
                profile_avatar: userAvatar,
                id: userId,
                location: userLocation,
                nickname: userNickname,
              },
            },
          });
        })
        .catch((error) => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 500) {
            setErrors(['reusable:errors:500']);
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else if (error.response.status === 422) {
            setErrors(['reusable:errors:422-conversation']);
          } else {
            setErrors(error.response.data.error);
          }
        });
    }
  };

  if (ready) {
    let sortedHistory = props.inHistoryBookings;
    sortedHistory.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    if (props.inHistoryBookings.length > 0) {
      return (
        <>
          <p className='small-centered-paragraph'>
            <Trans count={parseInt(props.inHistoryBookings.length)} i18nKey='IncomingHistory:main-title'>
              <strong>You have {{ count: props.inHistoryBookings.length }} past booking.</strong>
            </Trans>
          </p>
          {sortedHistory.map((booking) => {
            if (booking.status === 'declined') {
              return (
                <Container
                  style={{ backgroundColor: '#e8e8e8', marginTop: '2rem', padding: '2rem' }}
                  id={booking.id}
                  data-cy='incoming-history'
                  key={booking.id}
                >
                  <p className='small-centered-paragraph'>
                    <strong>{t('IncomingHistory:declined-request')}</strong>
                  </p>
                  <p className='small-centered-paragraph'>
                    <Trans count={parseInt(booking.number_of_cats)} i18nKey='IncomingHistory:declined-desc'>
                      You declined a booking request from <strong>{{ nickname: booking.user.nickname }}</strong> for
                      their <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of
                      <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                      <strong>
                        {{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}
                      </strong>
                      .
                    </Trans>
                  </p>
                  <Popup
                    modal
                    trigger={<p className='fake-link-underlined'>{t('IncomingHistory:view-message')}</p>}
                    position='top center'
                    closeOnDocumentClick={true}
                  >
                    <IncRequestDeclinedPopup
                      id={booking.id}
                      nickname={booking.user.nickname}
                      message={booking.host_message}
                      startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                      endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                    />
                  </Popup>
                </Container>
              );
            } else if (booking.status === 'canceled') {
              return (
                <Container
                  style={{ backgroundColor: '#e8e8e8', marginTop: '2rem', padding: '2rem' }}
                  id={booking.id}
                  data-cy='incoming-history'
                  key={booking.id}
                >
                  <p className='small-centered-paragraph'>
                    <strong>{t('IncomingHistory:canceled-request')}</strong>
                  </p>
                  <p className='small-centered-paragraph'>
                    <Trans count={parseInt(booking.number_of_cats)} i18nKey='IncomingHistory:canceled-desc'>
                      A booking request from <strong>{{ nickname: booking.user.nickname }}</strong> for their
                      <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of
                      <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                      <strong>
                        {{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}
                      </strong>
                      got canceled due to no answer from you within 3 days time.
                    </Trans>
                  </p>
                </Container>
              );
            } else {
              return (
                <>
                  <Container
                    style={{
                      backgroundColor: booking.review_id === null ? '#f3dde6' : '#e8e8e8',
                      marginTop: '2rem',
                      padding: '2rem',
                    }}
                    id={booking.id}
                    data-cy='incoming-history'
                    key={booking.id}
                  >
                    <p className='small-centered-paragraph'>
                      <Trans i18nKey='IncomingHistory:other-history'>
                        You hosted <strong>{{ nickname: booking.user.nickname }}'s</strong> cat(s) during the dates of
                        <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                        <strong>
                          {{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}
                        </strong>
                        .
                      </Trans>
                    </p>
                    {booking.review_id === null ? (
                      <p
                        className='fake-link-underlined'
                        id='ask-review'
                        onClick={(e) =>
                          messageUser(
                            e,
                            booking.host_id,
                            booking.user_id,
                            booking.user.profile_avatar,
                            booking.user.location,
                            booking.user.nickname
                          )
                        }
                      >
                        {t('IncomingHistory:ask-review')}
                      </p>
                    ) : (
                      <Popup
                        modal
                        trigger={<p className='fake-link-underlined'>{t('IncomingHistory:view-review')}</p>}
                        position='top center'
                        closeOnDocumentClick={true}
                      >
                        <ViewReviewPopup
                          id={booking.review_id}
                          startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                          endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                        />
                      </Popup>
                    )}
                  </Container>
                  {errors.length > 0 && (
                    <Message negative>
                      <ul id='message-error-list'>
                        {errors.map((error) => (
                          <li key={error}>{t(error)}</li>
                        ))}
                      </ul>
                    </Message>
                  )}
                </>
              );
            }
          })}
        </>
      );
    } else {
      return (
        <>
          <p className='small-centered-paragraph'>
            <strong>{t('IncomingHistory:no-past-bookings')}</strong>
          </p>
        </>
      );
    }
  } else {
    return <Spinner />;
  }
};

export default withRouter(IncomingHistory);
