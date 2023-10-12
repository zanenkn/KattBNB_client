import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation, conditions as validate } from '../../Modules/formValidation';

import { Flexbox, Text, TextField, Notice, Button } from '../../UI-Components';

const MaxCatsUpdateForm = ({ id, maxCats, toggleForm, setElement }) => {
  const { t } = useTranslation('HostProfileForm');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMaxCats, setNewMaxCats] = useState(maxCats);

  useEffect(() => {
    return () => {
      setNewMaxCats(maxCats)
    }
  }, [])

  const validator = formValidation({
    fields: [
      {
        condition: validate.nonEmptyString(newMaxCats),
        error: 'HostProfileForm:errors.max-cats',
      },
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const updateMaxCats = () => {
    const lang = detectLanguage();
    setLoading(true);

    const path = `/api/v1/host_profiles/${id}`;
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    const payload = {
      max_cats_accepted: newMaxCats,
      locale: lang,
    };
    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        setElement('maxCats', newMaxCats);
        toggleForm();
        setErrors([]);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (error.response.status === 500) {
          setErrors(['reusable:errors.500']);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors.401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
        }
      });
  };
  return (
    <>
      <Text>{t('HostProfileForm:helpers.max-cats')}</Text>
      <TextField
        space={5}
        min='1'
        type='number'
        label={t('HostProfileForm:labels.max-cats')}
        data-cy='new'
        value={newMaxCats}
        onChange={(e) => setNewMaxCats(Math.round(Math.abs(e.target.value)) || '')}
        required
        onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(updateMaxCats)}
      />

      {errors.length > 0 && (
        <Notice nature='danger' data-cy='error'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
      <Flexbox spaceItemsX={2}>
        <Button secondary color='neutral' data-cy='close' onClick={() => toggleForm()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          data-cy='submit'
          color='info'
          loading={loading}
          disabled={loading}
          onClick={() => validator.onSubmit(updateMaxCats)}
        >
          {t('reusable:cta.save')}
        </Button>
      </Flexbox>
    </>
  );
};

export default MaxCatsUpdateForm;
