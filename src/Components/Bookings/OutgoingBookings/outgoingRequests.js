import React, { useState } from 'react';
import moment from 'moment';
import Spinner from '../../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import OutRequestUserMessagePopup from './outRequestUserMessagePopup';
import { Text } from '../../../UI-Components';
import Booking from '../common/booking';

const OutgoingRequests = ({ bookings }) => {
  const { t, ready } = useTranslation('OutgoingRequests');

  const [userMessagePopupOpened, setUserMessagePopupOpened] = useState(false);

  if (!ready) return <Spinner />;

  if (bookings.length < 1) {
    return (
      <Text bold centered>
        {t('OutgoingRequests:no-req')}
      </Text>
    );
  }

  return (
    <>
      <Text centered bold space={2}>
        <Trans count={parseInt(bookings.length)} i18nKey='OutgoingRequests:main-header'>
          You have made {{ count: bookings.length }} booking request.
        </Trans>
      </Text>
      <Text space={6} centered>
        {t('OutgoingRequests:desc')}
      </Text>
      {bookings.map((request) => {
        return (
          <Booking
            key={'bookingnr' + request.id}
            testId='outgoing-requests'
            text={
              <Trans count={parseInt(request.number_of_cats)} i18nKey='OutgoingRequests:req-desc'>
                You have requested to book a stay with <strong>{{ nickname: request.host_nickname }}</strong> for your
                <strong>{{ count: request.number_of_cats }} cat</strong> during the dates of
                <strong>{{ startDate: moment(request.dates[0]).format('YYYY-MM-DD') }}</strong> until
                <strong>{{ endDate: moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
              </Trans>
            }
            extraText={
              <Trans i18nKey='OutgoingRequests:reply-before'>
                You will receive a reply before
                <strong>{{ date: moment(request.created_at).add(3, 'days').format('YYYY-MM-DD') }}</strong>.
              </Trans>
            }
            booking={request}
            links={[
              {
                text: t('OutgoingRequests:view-message'),
                action: () => setUserMessagePopupOpened(request.id),
              },
            ]}
          >
            <OutRequestUserMessagePopup
              id={request.id}
              open={userMessagePopupOpened === request.id}
              onClose={() => setUserMessagePopupOpened(false)}
              nickname={request.user.nickname}
              message={request.message}
              avatar={request.user.profile_avatar}
              startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
              endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
            />
          </Booking>
        );
      })}
    </>
  );
};

export default OutgoingRequests;
