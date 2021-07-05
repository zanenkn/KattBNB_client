import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Button, Notice, Dropdown, Text, Toggle } from '../../UI-Components';
import { ButtonWrapper, FlexWrapper } from './styles';
// Migration in progress

const NotificationsUpdateForm = (props) => {
  const { t, ready } = useTranslation('NotificationsUpdateForm');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [messageNotifications, setMessageNotifications] = useState(props.messageNotifications);

  const updateMessageNotification = () => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (messageNotifications === props.messageNotifications) {
        setLoading(false);
        setErrors(['NotificationsUpdateForm:update-error']);
      } else {
        setLoading(true);
        const lang = detectLanguage();
        const path = '/api/v1/auth/';
        const payload = {
          message_notification: messageNotifications,
          locale: lang,
        };
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token'),
        };
        axios
          .put(path, payload, { headers: headers })
          .then(() => {
            window.alert(t('NotificationsUpdateForm:update-success'));
            window.location.reload();
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              setLoading(false);
              setErrors(['reusable:errors:500']);
            } else if (error.response.status === 401 || error.response.status === 404) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              setLoading(false);
              setErrors(error.response.data.errors.full_messages);
            }
          });
      }
    }
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <FlexWrapper>
        <Toggle checked={messageNotifications} onClick={() => setMessageNotifications(!messageNotifications)} />
        <Text tint={messageNotifications ? 100 : 60}>{t('NotificationsUpdateForm:label')}</Text>
      </FlexWrapper>
    </>
    // <div>
    //   <Divider />
    //   <div style={{ maxWidth: '194px', margin: 'auto' }}>
    //     <div style={{ display: 'inline-flex' }}>
    //       <div className='toggle' onClick={() => setMessageNotifications(!messageNotifications)}>
    //         <Checkbox style={{ marginRight: '1em', padding: '0.5em' }} toggle checked={messageNotifications} />
    //       </div>
    //       <label style={{ paddingLeft: '1.5em', color: messageNotifications ? 'grey' : 'silver', fontSize: 'small' }}>
    //         {t('NotificationsUpdateForm:label')}
    //       </label>
    //     </div>
    //     {errors.length > 0 && (
    //       <Message negative>
    //         <Message.Header style={{ textAlign: 'center' }}>{t('reusable:errors:action-error-header')}</Message.Header>
    //         <ul id='message-error-list'>
    //           {errors.map((error) => (
    //             <li key={error}>{t(error)}</li>
    //           ))}
    //         </ul>
    //       </Message>
    //     )}
    //     <div className='button-wrapper'>
    //       <Button secondary className='cancel-button' onClick={() => props.closeLocationAndPasswordForms()}>
    //         {t('reusable:cta.close')}
    //       </Button>
    //       <Button
    //         id='notifications-submit-button'
    //         className='submit-button'
    //         loading={loading}
    //         disabled={loading}
    //         onClick={() => updateMessageNotification()}
    //       >
    //         {t('reusable:cta.change')}
    //       </Button>
    //     </div>
    //   </div>
    //   <Divider style={{ marginBottom: '2rem' }} />
    // </div>
  );
};

export default NotificationsUpdateForm;
