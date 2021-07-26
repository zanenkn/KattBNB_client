import React from 'react';
import moment from 'moment';
import Spinner from '../../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Booking from './booking';
import { Text } from '../../../UI-Components';

const OutgoingUpcoming = ({ bookings, history }) => {
  const { t, ready } = useTranslation('OutgoingUpcoming');

  if (!ready) return <Spinner />;

  if (bookings.length < 1) {
    return (
      <Text bold centered>
        {t('OutgoingUpcoming:no-upc')}
      </Text>
    );
  }

  return (
    <>
      <Text centered bold space={2}>
        <Trans count={parseInt(bookings.length)} i18nKey='OutgoingUpcoming:main-header'>
          <strong>You have {{ count: bookings.length }} upcoming booking.</strong>
        </Trans>
      </Text>
      <Text space={6} centered>
        {t('OutgoingUpcoming:desc')}
      </Text>
      {bookings.map((upcoming) => {
        return (
          <Booking
            key={'bookingnr' + upcoming.id}
            testId='outgoing-upcoming'
            text={
              <Trans count={parseInt(upcoming.number_of_cats)} i18nKey='OutgoingUpcoming:upc-desc'>
                You have successfully booked a stay with <strong>{{ nickname: upcoming.host_nickname }}</strong> for
                your <strong>{{ count: upcoming.number_of_cats }} cat</strong> for the dates of
                <strong>{{ startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD') }}</strong> until
                <strong>{{ endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
              </Trans>
            }
            booking={upcoming}
            links={[
              {
                text: t('OutgoingUpcoming:details'),
                action: () => {
                  history.push({
                    pathname: '/booking-details',
                    state: {
                      hostId: upcoming.host_id,
                      avatar: upcoming.host_avatar,
                      description: upcoming.host_description,
                      nickname: upcoming.host_nickname,
                      startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD'),
                      endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD'),
                      priceTotal: upcoming.price_total,
                      address: upcoming.host_full_address,
                      lat: upcoming.host_real_lat,
                      long: upcoming.host_real_long,
                      location: upcoming.host_location,
                      numberOfCats: upcoming.number_of_cats,
                      hostProfileId: upcoming.host_profile_id,
                      score: upcoming.host_profile_score,
                    },
                  });
                },
              },
              {
                text: t('reusable:cta:view-receipt'),
                action: () => {
                  history.push({
                    pathname: '/booking-receipt',
                    state: {
                      nickname: upcoming.host_nickname,
                      startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD'),
                      endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD'),
                      priceTotal: upcoming.price_total,
                      numberOfCats: upcoming.number_of_cats,
                      bookingId: upcoming.id,
                      createdAt: moment(upcoming.created_at).format('YYYY-MM-DD'),
                    },
                  });
                },
              },
            ]}
          />
        );
      })}
    </>
  );
};

export default withRouter(OutgoingUpcoming);
