import { useState } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { detectLanguage } from '../Modules/detectLanguage';

export const useStartConversation = () => {
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  const startConversation = ({ userId1, userId2 }) => {
    const lang = detectLanguage();
    const path = '/api/v1/conversations';
    const payload = {
      user1_id: userId1,
      user2_id: userId2,
      locale: lang,
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
        if (response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
        } else if (response.status === 422) {
          setErrors(['reusable:errors:422-conversation']);
        } else {
          setErrors(response.data.error);
        }
      });
  };

  return { startConversation, errors };
};
