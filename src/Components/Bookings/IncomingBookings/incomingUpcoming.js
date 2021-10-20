import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Spinner from '../../ReusableComponents/Spinner';
import Popup from 'reactjs-popup';
import { useTranslation, Trans } from 'react-i18next';
import axios from 'axios';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { Notice, Text } from '../../../UI-Components';
import Booking from '../common/booking';

const IncomingUpcoming = ({ id, history, bookings }) => {
  const { t, ready } = useTranslation('IncomingUpcoming');

  const [errors, setErrors] = useState([]);

  const messageUser = (userId, userAvatar, userLocation, userNickname) => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      const lang = detectLanguage();
      const path = '/api/v1/conversations';
      const payload = {
        user1_id: id,
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
        .then(({ data }) => {
          history.push({
            pathname: '/conversation',
            state: {
              id: data.id,
              user: {
                profile_avatar: userAvatar,
                id: userId,
                location: userLocation,
                nickname: userNickname,
              },
            },
          });
        })
        .catch(({ response }) => {
          if (response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (response.status === 500) {
            setErrors(['reusable:errors:500']);
          } else if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else if (response.status === 422) {
            setErrors(['reusable:errors:422-conversation']);
          } else {
            setErrors(response.data.error);
          }
        });
    }
  };
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
                action: () =>
                  messageUser(
                    upcoming.user_id,
                    upcoming.user.profile_avatar,
                    upcoming.user.location,
                    upcoming.user.nickname
                  ),
              },
            ]}
          />
        );
      })}
    </>
  );

  // if (ready) {
  //   let sortedUpcoming = upcoming;
  //   sortedUpcoming.sort((a, b) => a.dates[0] - b.dates[0]);

  //   return (
  //     <>
  //       {upcoming.length > 0 ? (
  //         <>
  //           <Popup
  //             modal
  //             open={errors.length > 0}
  //             closeOnDocumentClick={true}
  //             onClose={() => setErrors([])}
  //             position='top center'
  //           >
  //             <div>
  //               {errors.length > 0 && (
  //                 <Message negative>
  //                   <ul id='message-error-list'>
  //                     {errors.map((error) => (
  //                       <li key={error}>{t(error)}</li>
  //                     ))}
  //                   </ul>
  //                 </Message>
  //               )}
  //             </div>
  //           </Popup>
  //           <p className='small-centered-paragraph'>
  //             <Trans count={parseInt(upcoming.length)} i18nKey='IncomingUpcoming:main-title'>
  //               <strong>You have {{ count: upcoming.length }} upcoming booking.</strong>
  //             </Trans>
  //           </p>
  //           <p style={{ textAlign: 'center' }}>{t('IncomingUpcoming:main-desc')}</p>
  //           {sortedUpcoming.map((upcoming) => {
  //             return (
  //               <Container
  //                 style={{ backgroundColor: '#e8e8e8', marginTop: '2rem', padding: '2rem' }}
  //                 id={upcoming.id}
  //                 data-cy='incoming-upcoming'
  //                 key={upcoming.id}
  //               >
  //                 <p className='small-centered-paragraph'>
  //                   <Trans count={parseInt(upcoming.number_of_cats)} i18nKey='IncomingUpcoming:booking-info'>
  //                     You have approved a stay for <strong>{{ nickname: upcoming.user.nickname }}'s</strong>&nbsp;
  //                     <strong>{{ count: upcoming.number_of_cats }} cat</strong> for the dates of
  //                     <strong>{{ startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD') }}</strong> until
  //                     <strong>
  //                       {{ endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD') }}
  //                     </strong>
  //                     .
  //                   </Trans>
  //                 </p>
  //                 <p
  //                   className='fake-link-underlined'
  //                   onClick={(e) =>
  //                     messageUser(
  //                       e,
  //                       upcoming.user_id,
  //                       upcoming.user.profile_avatar,
  //                       upcoming.user.location,
  //                       upcoming.user.nickname
  //                     )
  //                   }
  //                 >
  //                   {t('IncomingUpcoming:message')} {upcoming.user.nickname}
  //                 </p>
  //               </Container>
  //             );
  //           })}
  //         </>
  //       ) : (
  //         <>
  //           <p className='small-centered-paragraph'>
  //             <strong>{t('IncomingUpcoming:no-bookings')}</strong>
  //           </p>
  //         </>
  //       )}
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default withRouter(connect(mapStateToProps)(IncomingUpcoming));
