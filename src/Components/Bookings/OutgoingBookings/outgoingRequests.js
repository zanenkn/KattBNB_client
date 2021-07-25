import React from 'react';
import moment from 'moment';
import Spinner from '../../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';
import OutRequestUserMessagePopup from '../OutRequestUserMessagePopup';
import { Text, Container } from '../../../UI-Components';

const OutgoingRequests = ({ bookings }) => {
  const { t, ready } = useTranslation('OutgoingRequests');

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
      <Text centered bold>
        <Trans count={parseInt(bookings.length)} i18nKey='OutgoingRequests:main-header'>
          You have made {{ count: bookings.length }} booking request.
        </Trans>
      </Text>
      <Text centered>{t('OutgoingRequests:desc')}</Text>
      {bookings.map((request) => {
        return (
          <Container
            style={{ backgroundColor: '#e8e8e8', marginTop: '2rem', padding: '2rem' }}
            id={request.id}
            data-cy='outgoing-requests'
            key={request.id}
          >
            <p className='small-centered-paragraph'>
              <Trans count={parseInt(request.number_of_cats)} i18nKey='OutgoingRequests:req-desc'>
                You have requested to book a stay with <strong>{{ nickname: request.host_nickname }}</strong> for your{' '}
                <strong>{{ count: request.number_of_cats }} cat</strong> during the dates of
                <strong>{{ startDate: moment(request.dates[0]).format('YYYY-MM-DD') }}</strong> until
                <strong>{{ endDate: moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
              </Trans>
            </p>
            <p className='small-centered-paragraph'>
              <Trans i18nKey='OutgoingRequests:reply-before'>
                You will receive a reply before
                <strong>{{ date: moment(request.created_at).add(3, 'days').format('YYYY-MM-DD') }}</strong>.
              </Trans>
            </p>
            <Popup
              modal
              trigger={<p className='fake-link-underlined'>{t('OutgoingRequests:view-message')}</p>}
              position='top center'
              closeOnDocumentClick={true}
            >
              <OutRequestUserMessagePopup
                id={request.id}
                nickname={request.user.nickname}
                message={request.message}
                avatar={request.user.profile_avatar}
                startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
              />
            </Popup>
          </Container>
        );
      })}
    </>
  );
};

export default OutgoingRequests;
