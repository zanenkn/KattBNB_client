import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../../common/Spinner';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { RadioButton, Button, Text, Notice, Divider } from '../../UI-Components';
import { ButtonWrapper } from './styles';

const LangPrefUpdateForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [info, setInfo] = useState(null);
  const [langPref, setLangPref] = useState(props.langPref);

  const { t, ready } = useTranslation('LangPrefUpdateForm');

  const updateLangPref = () => {
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      return setErrors(['reusable:errors:window-navigator']);
    }
    if (langPref === props.langPref) {
      setLoading(false);
      return setInfo(['LangPrefUpdateForm:update-error']);
    }

    const lang = detectLanguage();
    const path = '/api/v1/auth/';
    const payload = {
      lang_pref: langPref,
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
        window.alert(t('LangPrefUpdateForm:update-success'));
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

  const handleRadioBtnClick = (value) => {
    setErrors([]);
    setInfo(null);
    setLangPref(value);
  };

  if (!ready) return <Spinner />;

  return (
    <>
      <Divider />
      <RadioButton
        label='Jag vill få epost från KattBNB på svenska'
        value='sv-SE'
        checked={langPref}
        onChange={() => handleRadioBtnClick('sv-SE')}
      />
      <RadioButton
        label='I want to get emails from KattBNB in English'
        value='en-US'
        checked={langPref}
        onChange={() => handleRadioBtnClick('en-US')}
      />
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
        <Button secondary color='neutral' onClick={() => props.closeLocationAndPasswordForms()}>
          {t('reusable:cta.cancel')}
        </Button>

        <Button
          id='email-language-submit-button'
          color='info'
          loading={loading}
          disabled={loading}
          onClick={() => updateLangPref()}
        >
          {t('reusable:cta.save')}
        </Button>
      </ButtonWrapper>
      <Divider top={5}/>
    </>
  );
};

export default LangPrefUpdateForm;
