import { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import useCurrentScope from '../hooks/useCurrentScope';
import { wipeCredentials } from '../Modules/wipeCredentials';

export const useStartConversation = () => {
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { locale, headers } = useCurrentScope();

  const startConversation = ({ userId1, userId2 }) => {
    const path = '/api/v1/conversations';
    const payload = {
      user1_id: userId1,
      user2_id: userId2,
      locale: locale,
    };

    if (!userId1) {
      navigate('/login');
      return;
    }
    axios
      .post(path, payload, { headers: headers })
      .then(({ data }) => {
        navigate(`/conversation/${data.id}`);
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
