import React, { useState } from 'react';
import moment from 'moment';
import Spinner from '../../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import ViewYourReviewPopup from '../viewYourReviewPopup';
import OutRequestDeclinedPopup from '../outRequestDeclinedPopup';
import OutRequestCancelledPopup from '../outRequestCancelledPopup';
import { withRouter } from 'react-router-dom';
import Booking from '../common/booking';
import { Text } from '../../../UI-Components';

const OutgoingHistory = ({ bookings, history }) => {
  const { t, ready } = useTranslation('OutgoingHistory');

  const [bookingDeclinedPopupOpened, setBookingDeclinedPopupOpened] = useState(false);
  const [bookingCanceledPopupOpened, setBookingCanceledPopupOpened] = useState(false);
  const [viewReviewPopupOpened, setViewReviewPopupOpened] = useState(false);

  if (!ready) return <Spinner />;

  if (bookings.length < 1) {
    return (
      <Text bold centered>
        {t('OutgoingHistory:no-history')}
      </Text>
    );
  }

  return (
    <>
      <Text centered bold space={6}>
        <Trans count={parseInt(bookings.length)} i18nKey='OutgoingHistory:main-header'>
          You have {{ count: bookings.length }} past booking.
        </Trans>
      </Text>
      {bookings.map((booking) => {
        if (booking.status === 'declined') {
          return (
            <Booking
              key={'bookingnr' + booking.id}
              testId='outgoing-history'
              header={t('OutgoingHistory:declined-req-header')}
              text={
                <Trans count={parseInt(booking.number_of_cats)} i18nKey='OutgoingHistory:declined-req-desc'>
                  Your request to book a stay with <strong>{{ nickname: booking.host_nickname }}</strong> for your
                  <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of
                  <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                  <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>
                  got declined.
                </Trans>
              }
              booking={booking}
              links={[{ text: t('OutgoingHistory:view-message'), action: () => setBookingDeclinedPopupOpened(true) }]}
            >
              <OutRequestDeclinedPopup
                open={bookingDeclinedPopupOpened}
                onClose={() => setBookingDeclinedPopupOpened(false)}
                id={booking.id}
                nickname={booking.host_nickname}
                message={booking.host_message}
                avatar={booking.host_avatar}
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
              testId='outgoing-history'
              header={t('OutgoingHistory:canceled-req-header')}
              text={
                <Trans count={parseInt(booking.number_of_cats)} i18nKey='OutgoingHistory:canceled-req-desc'>
                  Your request to book a stay with <strong>{{ nickname: booking.host_nickname }}</strong> for your
                  <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of
                  <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                  <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>
                  got canceled.
                </Trans>
              }
              booking={booking}
              links={[{ text: t('OutgoingHistory:why'), action: () => setBookingCanceledPopupOpened(true) }]}
            >
              <OutRequestCancelledPopup
                open={bookingCanceledPopupOpened}
                onClose={() => setBookingCanceledPopupOpened(false)}
                nickname={booking.host_nickname}
                startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
              />
            </Booking>
          );
        }
        return (
          <Booking
            key={'bookingnr' + booking.id}
            testId='outgoing-history'
            text={
              <Trans i18nKey='OutgoingHistory:req-desc'>
                Your cat(s) stayed with <strong>{{ nickname: booking.host_nickname }}</strong> during the dates of
                <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until
                <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
              </Trans>
            }
            extraText={
              booking.review_id === null && booking.host_profile_id === null && t('OutgoingHistory:no-host-no-review')
            }
            booking={booking}
            cta={
              booking.review_id === null &&
              booking.host_profile_id !== null && {
                text: t('OutgoingHistory:leave-review'),
                action: () => {
                  history.push({
                    pathname: '/leave-a-review',
                    state: {
                      userId: booking.user_id,
                      hostProfileId: booking.host_profile_id,
                      bookingId: booking.id,
                      hostNickname: booking.host_nickname,
                      startDate: moment(booking.dates[0]).format('YYYY-MM-DD'),
                      endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD'),
                    },
                  });
                },
              }
            }
            links={[
              booking.review_id !== null && {
                text: t('OutgoingHistory:view-review'),
                action: () => setViewReviewPopupOpened(true),
              },
              {
                text: t('reusable:cta:view-receipt'),
                action: () => {
                  history.push({
                    pathname: '/booking-receipt',
                    state: {
                      nickname: booking.host_nickname,
                      startDate: moment(booking.dates[0]).format('YYYY-MM-DD'),
                      endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD'),
                      priceTotal: booking.price_total,
                      numberOfCats: booking.number_of_cats,
                      bookingId: booking.id,
                      createdAt: moment(booking.created_at).format('YYYY-MM-DD'),
                    },
                  });
                },
              },
            ]}
          >
            <ViewYourReviewPopup
              open={viewReviewPopupOpened}
              onClose={() => setViewReviewPopupOpened(false)}
              id={booking.review_id}
              startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
              endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
            />
          </Booking>
        );
      })}
    </>
  );
};

export default withRouter(OutgoingHistory);
