import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import useCurrentScope from '../../hooks/useCurrentScope';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation, conditions as validate } from '../../Modules/formValidation';

import { Flexbox, Text, TextField, Notice, Button } from '../../UI-Components';

const SupplementUpdateForm = ({ id, supplement, toggleForm, setElement }) => {
  const { t } = useTranslation('HostProfileForm');
  const { locale, headers } = useCurrentScope();

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSupplement, setNewSupplement] = useState(supplement);

  useEffect(() => {
    return () => {
      setNewSupplement(supplement);
    };
  }, []);

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
    setLoading(true);

    if (newSupplement === supplement) {
      toggleForm();
      return;
    }

    const path = `/api/v1/host_profiles/${id}`;

    const payload = {
      supplement_price_per_cat_per_day: newSupplement,
      locale: locale,
    };
    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        setElement('supplement', newSupplement);
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
      <Text>{t('HostProfileForm:helpers.supplement')}</Text>
      <TextField
        space={5}
        min='1'
        type='number'
        label={t('HostProfileForm:labels.supplement')}
        data-cy='new'
        value={newSupplement}
        onChange={(e) => setNewSupplement(Math.abs(e.target.value) || '')}
        required
        onKeyPress={(e) => e.key === 'Enter' && validator.onSubmit(updateSupplement)}
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
          onClick={() => validator.onSubmit(updateSupplement)}
        >
          {t('reusable:cta.save')}
        </Button>
      </Flexbox>
    </>
  );
};

export default SupplementUpdateForm;
