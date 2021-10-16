import React, { useState } from 'react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import Popup from 'reactjs-popup';
import { Header, Text } from '../../UI-Components';
import { PopupHeaderWrapper } from './common/styles';

const DeclineRequestPopup = ({open, onClose, startDate, endDate, nickname, id, declModalCloseState }) => {
  const { t, ready } = useTranslation('DeclineRequestPopup');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState('');

  const declineBooking = (e) => {
    e.preventDefault();
    const lang = detectLanguage();
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
      declModalCloseState(true);
    } else {
      if (window.confirm(t('DeclineRequestPopup:confirm-decline'))) {
        if (message !== '' && message.length < 201) {
          const path = `/api/v1/bookings/${id}`;
          const headers = {
            uid: window.localStorage.getItem('uid'),
            client: window.localStorage.getItem('client'),
            'access-token': window.localStorage.getItem('access-token'),
          };
          const payload = {
            host_message: message,
            status: 'declined',
            locale: lang,
          };
          axios
            .patch(path, payload, { headers: headers })
            .then(() => {
              window.location.replace('/all-bookings');
            })
            .catch((error) => {
              if (error.response === undefined) {
                wipeCredentials('/is-not-available?atm');
              } else if (error.response.status === 500) {
                setLoading(false);
                setErrors(['reusable:errors:500']);
                declModalCloseState(true);
              } else if (error.response.status === 401) {
                window.alert(t('reusable:errors:401'));
                wipeCredentials('/');
              } else {
                setLoading(false);
                setErrors(error.response.data.error);
                declModalCloseState(true);
              }
            });
        } else {
          setLoading(false);
          setErrors(['DeclineRequestPopup:decline-error']);
          declModalCloseState(true);
        }
      } else {
        setLoading(false);
        declModalCloseState(true);
      }
    }
  };

  const declineCTA = (e) => {
    declModalCloseState(false);
    declineBooking(e);
  };

  if (!ready) return <Spinner />;

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Header level={3} color='white' space={2}>
          {t('DeclineRequestPopup:page-header')}
        </Header>
      </PopupHeaderWrapper>

      <Text>
        something
      </Text>
    </Popup>
  );





  // if (ready) {
  //   return (
  //     <>
  //       <Header as='h2'>{t('DeclineRequestPopup:page-header')}</Header>
  //       <p className='small-centered-paragraph'>
  //         <Trans i18nKey='DeclineRequestPopup:page-desc'>
  //           You are about to decline a booking request from
  //           <strong style={{ color: '#c90c61' }}>{{ nickname: props.nickname }}</strong> for the dates of
  //           <strong style={{ color: '#c90c61' }}>{{ startDate: props.startDate }}</strong> until
  //           <strong style={{ color: '#c90c61' }}>{{ endDate: props.endDate }}</strong>
  //         </Trans>
  //       </p>
  //       <Form>
  //         <Form.TextArea
  //           style={{ minHeight: '120px' }}
  //           label={t('DeclineRequestPopup:text-area-label')}
  //           placeholder={t('DeclineRequestPopup:text-area-plch')}
  //           required
  //           id='message'
  //           value={message}
  //           onChange={(e) => setMessage(e.target.value)}
  //         />
  //       </Form>
  //       <p style={{ textAlign: 'end', fontSize: 'smaller', fontStyle: 'italic' }}>
  //         {t('reusable:remaining-chars')} {200 - message.length}
  //       </p>
  //       {errors.length > 0 && (
  //         <Message negative>
  //           <Message.Header style={{ textAlign: 'center' }}>
  //             {t('DeclineRequestPopup:error-message-header')}
  //           </Message.Header>
  //           <ul id='message-error-list'>
  //             {errors.map((error) => (
  //               <li key={error}>{t(error)}</li>
  //             ))}
  //           </ul>
  //         </Message>
  //       )}
  //       <Button id='decline-button' disabled={loading} loading={loading} onClick={declineCTA}>
  //         {t('DeclineRequestPopup:decline-cta')}
  //       </Button>
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default DeclineRequestPopup;
