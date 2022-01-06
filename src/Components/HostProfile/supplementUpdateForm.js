import React, { useState } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation, conditions as validate } from '../../Modules/formValidation';

import { Flexbox, Text, TextField, Notice, Button } from '../../UI-Components';

const SupplementUpdateForm = ({ id, supplement, closeAllForms, setElement }) => {
  const { t } = useTranslation('HostProfileForm');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSupplement, setNewSupplement] = useState(supplement);

  const validator = formValidation({
    fields: [
      {
        condition: validate.nonEmptyString(newSupplement),
        error: 'HostProfileForm:errors.supplement',
      },
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const updateSupplement = () => {
    const lang = detectLanguage();
    setLoading(true);

    if (newSupplement === supplement) {
      closeAllForms();
      return;
    }

    const path = `/api/v1/host_profiles/${id}`;
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    const payload = {
      supplement_price_per_cat_per_day: newSupplement,
      locale: lang,
    };
    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        setElement('supplement', newSupplement);
        closeAllForms();
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
      <Text>{t('HostProfileForm:helpers.supplement')}</Text>
      <TextField
        space={5}
        min='1'
        type='number'
        label={t('HostProfileForm:labels.supplement')}
        id='supplement'
        value={newSupplement.toString()}
        onChange={(e) => setNewSupplement((Math.abs(e.target.value) || '').toString())}
        required
        onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(updateSupplement)}
      />

      {errors.length > 0 && (
        <Notice nature='danger'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
      <Flexbox spaceItemsX={2}>
        <Button secondary color='neutral' id='supplement-close-button' onClick={() => closeAllForms()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          id='supplement-submit-button'
          color='info'
          loading={loading}
          disabled={loading}
          onClick={() => validator.onSubmit(updateSupplement)}
        >
          {t('reusable:cta.save')}
        </Button>
      </Flexbox>
    </>
  );
};

export default SupplementUpdateForm;
