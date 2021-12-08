import React, { useState } from 'react';
import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import Popup from 'reactjs-popup';
import IncRequestDeclinedPopup from './incRequestDeclinedPopup';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { withRouter } from 'react-router-dom';
import ViewReviewPopup from './viewReviewPopup';
import Booking from '../common/booking';
import { Text, Notice } from '../../../UI-Components';
// Completely MIGRATED

const IncomingHistory = ({ bookings, history }) => {
  const { t, ready } = useTranslation('IncomingHistory');

  const [bookingDeclinedPopupOpened, setBookingDeclinedPopupOpened] = useState(false);
  const [viewReviewPopupOpened, setViewReviewPopupOpened] = useState(false);
  const [errors, setErrors] = useState([]);

  const messageUser = (hostId, userId, userAvatar, userLocation, userNickname) => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    }
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
        history.push({
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
  };

  if (!ready) return <Spinner />;

  if (bookings.length < 1) {
    return (
      <Text bold centered>
        {t('IncomingHistory:no-past-bookings')}
      </Text>
    );
  }

  return (
    <>
      <Text centered bold space={6}>
        <Trans count={parseInt(bookings.length)} i18nKey='IncomingHistory:main-title'>
          You have {{ count: bookings.length }} past booking.
        </Trans>
      </Text>

      <Popup
        modal
        open={errors.length > 0}
        closeOnDocumentClick={true}
        onClose={() => setErrors([])}
        position='top center'
      >
        <div>
          {errors.length > 0 && (
            <Notice nature='danger'>
              <ul id='message-error-list'>
                {errors.map((error) => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Notice>
          )}
        </div>
      </Popup>

      {bookings.map((booking) => {
        if (booking.status === 'declined') {
          return (
            <Booking
              key={'bookingnr' + booking.id}
              testId='incoming-history'
              header={t('IncomingHistory:declined-request')}
              text={
                <Trans count={parseInt(booking.number_of_cats)} i18nKey='IncomingHistory:declined-desc'>
                  You declined a booking request from <strong>{{ nickname: booking.user.nickname }}</strong> for their
                  <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of
                  <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                  <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                </Trans>
              }
              booking={booking}
              links={[
                { text: t('IncomingHistory:view-message'), action: () => setBookingDeclinedPopupOpened(booking.id) },
              ]}
            >
              <IncRequestDeclinedPopup
                open={bookingDeclinedPopupOpened === booking.id}
                onClose={() => setBookingDeclinedPopupOpened(false)}
                id={booking.id}
                nickname={booking.user.nickname}
                message={booking.host_message}
                startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
              />
            </Booking>
          );
        }
        if (booking.status === 'canceled') {
          return (
            <Booking
              key={'bookingnr' + booking.id}
              testId='incoming-history'
              header={t('IncomingHistory:canceled-request')}
              text={
                <Trans count={parseInt(booking.number_of_cats)} i18nKey='IncomingHistory:canceled-desc'>
                  A booking request from <strong>{{ nickname: booking.user.nickname }}</strong> for their
                  <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of
                  <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                  <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>
                  got canceled due to no answer from you within 3 days time.
                </Trans>
              }
              booking={booking}
            ></Booking>
          );
        }
        return (
          <Booking
            key={'bookingnr' + booking.id}
            testId='incoming-history'
            text={
              <Trans i18nKey='IncomingHistory:other-history'>
                You hosted <strong>{{ nickname: booking.user.nickname }}'s</strong> cat(s) during the dates of
                <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
              </Trans>
            }
            booking={booking}
            cta={
              booking.review_id === null &&
              booking.host_profile_id !== null && {
                text: t('IncomingHistory:ask-review'),
                action: () =>
                  messageUser(
                    booking.host_id,
                    booking.user_id,
                    booking.user.profile_avatar,
                    booking.user.location,
                    booking.user.nickname
                  ),
              }
            }
            links={[
              booking.review_id !== null && {
                text: t('IncomingHistory:view-review'),
                action: () => setViewReviewPopupOpened(booking.review_id),
              },
            ]}
          >
            {booking.review_id && (
              <ViewReviewPopup
                id={booking.review_id}
                open={viewReviewPopupOpened === booking.review_id}
                onClose={() => setViewReviewPopupOpened(false)}
                startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
              />
            )}
          </Booking>
        );
      })}
    </>
  );
};

export default withRouter(IncomingHistory);
