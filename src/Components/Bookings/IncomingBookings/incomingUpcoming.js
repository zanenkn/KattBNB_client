import React, { useState } from 'react';

import moment from 'moment';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';
import { useTranslation, Trans } from 'react-i18next';

import Spinner from '../../../common/Spinner';
import { useStartConversation } from '../../../utils/useStartConversation';

import { Notice, Text } from '../../../UI-Components';
import Booking from '../common/booking';

const IncomingUpcoming = ({ id, bookings }) => {
  const { t, ready } = useTranslation('IncomingUpcoming');
  const [errors, setErrors] = useState([]);
  const { startConversation } = useStartConversation();

  if (!ready) return <Spinner />;

  if (bookings.length < 1) {
    return (
      <Text bold centered>
        {t('IncomingUpcoming:no-bookings')}
      </Text>
    );
  }

  return (
    <>
      <Text centered bold space={6}>
        <Trans count={parseInt(bookings.length)} i18nKey='IncomingUpcoming:main-title'>
          You have {{ count: bookings.length }} upcoming booking.
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
      {bookings.map((upcoming) => {
        return (
          <Booking
            key={'bookingnr' + upcoming.id}
            testId='incoming-upcoming'
            text={
              <Trans count={parseInt(upcoming.number_of_cats)} i18nKey='IncomingUpcoming:booking-info'>
                You have approved a stay for <strong>{{ nickname: upcoming.user.nickname }}'s</strong>&nbsp;
                <strong>{{ count: upcoming.number_of_cats }} cat</strong> for the dates of
                <strong>{{ startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD') }}</strong> until
                <strong>{{ endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
              </Trans>
            }
            booking={upcoming}
            links={[
              {
                text: `${t('IncomingUpcoming:message')} ${upcoming.user.nickname}`,
                action: () => startConversation({ userId1: id, userId2: upcoming.user_id }),
              },
            ]}
          />
        );
      })}
    </>
  );
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(IncomingUpcoming);
