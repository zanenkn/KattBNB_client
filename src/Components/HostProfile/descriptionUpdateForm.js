import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation, conditions as validate } from '../../Modules/formValidation';
import { Flexbox, Text, TextArea, Notice, Button, InlineLink } from '../../UI-Components';

const DescriptionUpdateForm = ({ description, id, setElement, closeAllForms }) => {
  const { t } = useTranslation('HostProfileForm');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDescription, setNewDescription] = useState(description);

  useEffect(() => {
    return () => {
      setNewDescription(description)
    }
  }, [])

  const validator = formValidation({
    fields: [
      {
        condition: validate.nonEmptyString(newDescription),
        error: 'HostProfileForm:errors.about',
      },
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const updateDescription = () => {
    const lang = detectLanguage();
    setLoading(true);

    if (newDescription === description) {
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
      description: newDescription,
      locale: lang,
    };
    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        setElement('description', newDescription);
        closeAllForms();
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
      <Text>
        <Trans i18nKey={'HostProfileForm:helpers.about'}>
          text
          <InlineLink color='info' as={Link} to='/blog/hur-skapar-man-en-bra-kattvaktsprofil' target='_blank'>
            link
          </InlineLink>
        </Trans>
      </Text>
      <TextArea
        space={5}
        required
        id='newDescription'
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
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
        <Button secondary color='neutral' id='description-close-button' onClick={() => closeAllForms()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          id='description-submit-button'
          color='info'
          loading={loading}
          disabled={loading}
          onClick={() => validator.onSubmit(updateDescription)}
        >
          {t('reusable:cta.save')}
        </Button>
      </Flexbox>
    </>
  );
};

export default DescriptionUpdateForm;
