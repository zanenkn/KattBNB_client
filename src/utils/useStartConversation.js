import { useState } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router-dom';

import useCurrentScope from '../hooks/useCurrentScope';
import { wipeCredentials } from '../Modules/wipeCredentials';

export const useStartConversation = () => {
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const { locale } = useCurrentScope();

  const startConversation = ({ userId1, userId2 }) => {
    const path = '/api/v1/conversations';
    const payload = {
      user1_id: userId1,
      user2_id: userId2,
      locale: locale,
    };
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    if (!userId1) {
      history.push('/login');
      return;
    }
    axios
      .post(path, payload, { headers: headers })
      .then(({ data }) => {
        history.push({
          pathname: `/conversation/${data.id}`,
        });
      })
      .catch(({ response }) => {
        if (response === undefined || response.status === 500) {
          setErrors(['reusable:errors.unknown']);
        }
        if (response.status === 401) {
          wipeCredentials('/login');
        }
        setErrors(response.data.errors);
      });
  };

  return { startConversation, errors };
};
