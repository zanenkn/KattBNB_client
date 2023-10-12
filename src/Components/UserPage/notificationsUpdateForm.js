import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../../common/Spinner';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { Button, Notice, Divider, Text, Toggle } from '../../UI-Components';
import { ButtonWrapper, NotificationsWrapper } from './styles';
// Migrated

const NotificationsUpdateForm = (props) => {
  const { t, ready } = useTranslation('NotificationsUpdateForm');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [messageNotifications, setMessageNotifications] = useState(props.messageNotifications);
  const [info, setInfo] = useState(null);

  const updateMessageNotification = () => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      return setErrors(['reusable:errors:window-navigator']);
    }

    if (messageNotifications === props.messageNotifications) {
      setLoading(false);
      return setInfo(['NotificationsUpdateForm:update-error']);
    }

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
  };

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Divider />
      <NotificationsWrapper>
        <Toggle checked={messageNotifications} onClick={() => setMessageNotifications(!messageNotifications)} data-cy='toggle'/>
        <Text tint={messageNotifications ? 100 : 60}>{t('NotificationsUpdateForm:label')}</Text>
      </NotificationsWrapper>

      {errors.length > 0 && (
        <Notice nature='danger'>
          <Text bold centered size='sm'>
            {t('reusable:errors:action-error-header')}
          </Text>
          <ul id='message-error-list'>
            {errors.map((error) => (
              <li key={error}>{t(error)}</li>
            ))}
          </ul>
        </Notice>
      )}

      {info && (
        <Notice nature='info'>
          <Text centered>{t(info)}</Text>
        </Notice>
      )}

      <ButtonWrapper>
        <Button secondary color='neutral' onClick={() => props.toggleForm()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          data-cy='submit'
          color='info'
          disabled={loading}
          loading={loading}
          onClick={() => updateMessageNotification()}
        >
          {t('reusable:cta.save')}
        </Button>
      </ButtonWrapper>
      <Divider top={5} bottom={6}/>
    </>
  );
};

export default NotificationsUpdateForm;
