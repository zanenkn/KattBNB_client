import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { RadioButton, Button, Text, Notice } from '../../UI-Components';
import { ButtonWrapper } from './styles';

const LangPrefUpdateForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [langPref, setLangPref] = useState(props.langPref);

  const { t, ready } = useTranslation('LangPrefUpdateForm');

  const handleLangPrefChange = (e) => {
    setLangPref(e.target.id);
  };

  const updateLangPref = () => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (langPref === props.langPref) {
        setLoading(false);
        setErrors(['LangPrefUpdateForm:update-error']);
      } else {
        setLoading(true);
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
      }
    }
  };

  if (!ready) return <Spinner />;

  return (
    <>
      <RadioButton
        label='Jag vill få epost från KattBNB på svenska'
        value='sv-SE'
        checked={langPref}
        onChange={() => setLangPref('sv-SE')}
      />
      <RadioButton
        label='I want to get emails from KattBNB in English'
        value='en-US'
        checked={langPref}
        onChange={() => setLangPref('en-US')}
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
      <ButtonWrapper>
        <Button secondary color='neutral' onClick={() => props.closeLocationAndPasswordForms()}>
          {t('reusable:cta.close')}
        </Button>

        <Button
          id='email-language-submit-button'
          color='success'
          loading={loading}
          disabled={loading}
          onClick={() => updateLangPref()}
        >
          {t('reusable:cta.change')}
        </Button>
      </ButtonWrapper>
    </>
  );

  //   return (
  //     <div>
  //       <Divider />
  //       <div style={{ maxWidth: '194px', margin: 'auto' }}>
  //         <div style={{ display: 'inline-flex' }}>
  //           <Form>
  //             <Form.Field>
  //               <Checkbox
  //                 radio
  //                 label={
  //                   <label style={{ color: langPref === 'sv-SE' ? 'grey' : 'silver', fontSize: 'small' }}>
  //                     Jag vill få epost från KattBNB på svenska
  //                   </label>
  //                 }
  //                 name='checkboxRadioGroup'
  //                 id='sv-SE'
  //                 checked={langPref === 'sv-SE'}
  //                 onChange={(e) => handleLangPrefChange(e)}
  //               />
  //             </Form.Field>
  //             <Form.Field>
  //               <Checkbox
  //                 radio
  //                 label={
  //                   <label style={{ color: langPref === 'en-US' ? 'grey' : 'silver', fontSize: 'small' }}>
  //                     I want to get emails from KattBNB in English
  //                   </label>
  //                 }
  //                 name='checkboxRadioGroup'
  //                 id='en-US'
  //                 checked={langPref === 'en-US'}
  //                 onChange={(e) => handleLangPrefChange(e)}
  //               />
  //             </Form.Field>
  //           </Form>
  //         </div>

  //         <div className='button-wrapper'>
  //           <Button secondary className='cancel-button' onClick={() => props.closeLocationAndPasswordForms()}>
  //             {t('reusable:cta.close')}
  //           </Button>
  //           <Button
  //             id='email-language-submit-button'
  //             className='submit-button'
  //             loading={loading}
  //             disabled={loading}
  //             onClick={() => updateLangPref()}
  //           >
  //             {t('reusable:cta.change')}
  //           </Button>
  //         </div>
  //       </div>
  //       <Divider style={{ marginBottom: '2rem' }} />
  //     </div>
  //   );
};

export default LangPrefUpdateForm;
