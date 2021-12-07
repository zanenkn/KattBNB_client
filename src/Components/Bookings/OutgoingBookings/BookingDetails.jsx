import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import HostProfileView from '../../HostProfileView/HostProfileView';
import Spinner from '../../ReusableComponents/Spinner';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Popup from 'reactjs-popup';
import { priceOfOneAmount } from '../../../Modules/PriceCalculations';
import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';

const BookingDetails = ({ history, id, location: { state } }) => {
  const { t, ready } = useTranslation('BookingDetails');

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (state === undefined || history.action === 'POP') {
      history.push({ pathname: '/' });
    }
    // eslint-disable-next-line
  }, []);

  const messageHost = () => {
    const { avatar, hostId, location, nickname } = state;
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (id === undefined) {
        history.push('/');
      } else {
        const lang = detectLanguage();
        const path = '/api/v1/conversations';
        const payload = {
          user1_id: id,
          user2_id: hostId,
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
                  profile_avatar: avatar,
                  id: hostId,
                  location: location,
                  nickname: nickname,
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
              setErrors([response.data.error]);
            }
          });
      }
    }
  };
  return <div>a</div>
  // if (ready) {
  //   const {
  //     address,
  //     avatar,
  //     description,
  //     endDate,
  //     hostId,
  //     hostProfileId,
  //     lat,
  //     long,
  //     nickname,
  //     numberOfCats,
  //     priceTotal,
  //     score,
  //     startDate,
  //   } = state;
  //   let total = priceOfOneAmount(priceTotal);

    
  //   return (
  //     <>
  //       <Popup
  //         modal
  //         open={errors.length > 0}
  //         closeOnDocumentClick={true}
  //         onClose={() => window.location.replace('/all-bookings')}
  //         position='top center'
  //       >
  //         <div>
  //           {errors.length > 0 && (
  //             <Message negative>
  //               <ul id='message-error-list'>
  //                 {errors.map((error) => (
  //                   <li key={error}>{t(error)}</li>
  //                 ))}
  //               </ul>
  //             </Message>
  //           )}
  //         </div>
  //       </Popup>
  //       <div className='expanding-wrapper' style={{ paddingTop: '2rem' }}>
  //         <Header as='h1'>{t('BookingDetails:booking-details')}</Header>
  //         <Segment className='whitebox'>
  //           <div style={{ margin: 'auto', display: 'table' }}>
  //             <p>
  //               <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
  //                 <path d='M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z' />
  //               </svg>
  //               &nbsp;{startDate} {t('BookingDetails:until')}
  //               &nbsp;{endDate}
  //             </p>
  //             <p>
  //               <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
  //                 <path d='M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z' />
  //               </svg>
  //               &nbsp;{address}
  //             </p>
  //             <p>
  //               <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
  //                 <path d='M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z' />
  //               </svg>
  //               &nbsp;{total} {t('reusable:price:total')}&ensp;
  //               <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 236.62 236.62'>
  //                 <path d='M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z' />
  //               </svg>
  //               &nbsp;{numberOfCats}
  //             </p>
  //           </div>
  //         </Segment>
  //       </div>
  //       <>
  //         <Header as='h2' style={{ margin: '1rem 0 0' }}>
  //           {t('BookingDetails:about-host')}
  //         </Header>
  //         <HostProfileView
  //           numberOfCats={numberOfCats}
  //           hostId={hostId}
  //           avatar={avatar}
  //           nickname={nickname}
  //           description={description}
  //           lat={lat}
  //           long={long}
  //           address={address}
  //           hostProfileId={hostProfileId}
  //           score={score}
  //           messageHost={messageHost}
  //         />
  //       </>
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

const mapStateToProps = (state) => ({ id: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(BookingDetails);