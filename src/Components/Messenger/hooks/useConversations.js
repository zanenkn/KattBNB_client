import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import useCurrentScope from '../../../hooks/useCurrentScope';

export const useConversations = () => {
  const { t } = useTranslation();
  const { locale, headers } = useCurrentScope();

  const [conversations, setConversations] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const path = '/api/v1/conversations';
    axios
      .get(path, { params: { locale: locale }, headers: headers })
      .then(({ data }) => {
        setConversations(data);
        setLoading(false);
        setErrors([]);
      })

      .catch(({ response }) => {
        if (response === undefined || response.status === 500) {
          setErrors(['reusable:errors.unknown']);
        }
        if (response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/login');
        }
        setLoading(false);
        setErrors(response.data.errors);
      });

    // eslint-disable-next-line
  }, []);

  return {
    conversations,
    loading,
    errors,
  };
};
