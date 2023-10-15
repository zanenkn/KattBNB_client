import React, { useState } from 'react';

import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import Popup from 'reactjs-popup';

import Booking from '../common/booking';
import Spinner from '../../../common/Spinner';
import { useStartConversation } from '../../../utils/useStartConversation';

import { Text, Notice } from '../../../UI-Components';

import IncRequestDeclinedPopup from './incRequestDeclinedPopup';
import ViewReviewPopup from './viewReviewPopup';

// Completely MIGRATED

const IncomingHistory = ({ bookings }) => {
  const { t, ready } = useTranslation('IncomingHistory');

  const [bookingDeclinedPopupOpened, setBookingDeclinedPopupOpened] = useState(false);
  const [viewReviewPopupOpened, setViewReviewPopupOpened] = useState(false);

  const { startConversation, errors } = useStartConversation();

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
                action: () => startConversation({ userId1: booking.host_id, userId2: booking.user_id }),
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

export default IncomingHistory;
