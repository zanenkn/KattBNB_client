import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { passwordCheck } from '../../Modules/passwordCheck';
import { useTranslation } from 'react-i18next';
import Spinner from '../../common/Spinner';

const PasswordUpdateForm = ({ closeLocationAndPasswordForms }) => {
  const { t, ready } = useTranslation('PasswordUpdateForm');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const listenEnterKeyPassword = (event) => {
    if (event.key === 'Enter') {
      updatePassword();
    }
  };

  const axiosCallErrorCatching = (errorMessage) => {
    setLoading(false);
    setErrors(errorMessage);
  };

  const updatePassword = () => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (newPassword === newPasswordConfirmation && passwordCheck(newPassword)) {
        setLoading(true);
        const lang = detectLanguage();
        const path = '/api/v1/auth/password';
        const payload = {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: newPasswordConfirmation,
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
            setErrors([]);
            window.alert(t('PasswordUpdateForm:success-alert'));
            wipeCredentials('/login');
          })
          .catch(({ response }) => {
            if (response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (response.status === 500) {
              axiosCallErrorCatching(['reusable:errors:500']);
            } else if (response.status === 401 || response.status === 404) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              axiosCallErrorCatching(response.data.errors.full_messages);
            }
          });
      } else {
        setErrors(['PasswordUpdateForm:error']);
      }
    }
  };
  return <div>a</div>
  // if (ready) {
  //   return (
  //     <>
  //       <Divider />
  //       <Form style={{ maxWidth: '194px', margin: 'auto' }}>
  //         <Form.Input
  //           required
  //           id='currentPassword'
  //           value={currentPassword}
  //           type='password'
  //           onChange={(e) => setCurrentPassword(e.target.value)}
  //           placeholder={t('PasswordUpdateForm:plch.current-pass')}
  //           onKeyPress={listenEnterKeyPassword}
  //         />
  //         <Form.Input
  //           required
  //           id='newPassword'
  //           value={newPassword}
  //           type='password'
  //           onChange={(e) => setNewPassword(e.target.value)}
  //           placeholder={t('PasswordUpdateForm:plch.new-pass')}
  //           onKeyPress={listenEnterKeyPassword}
  //         />
  //         <Form.Input
  //           required
  //           id='newPasswordConfirmation'
  //           value={newPasswordConfirmation}
  //           type='password'
  //           onChange={(e) => setNewPasswordConfirmation(e.target.value)}
  //           placeholder={t('PasswordUpdateForm:plch.new-pass-confirm')}
  //           onKeyPress={listenEnterKeyPassword}
  //         />
  //         <p className='small-centered-paragraph' style={{ marginBottom: '0' }}>
  //           {t('PasswordUpdateForm:info')}
  //         </p>
  //         {errors.length > 0 && (
  //           <Message negative style={{ width: 'inherit' }}>
  //             <Message.Header style={{ textAlign: 'center' }}>
  //               {t('reusable:errors.action-error-header')}
  //             </Message.Header>
  //             <ul id='message-error-list'>
  //               {errors.map((error) => (
  //                 <li key={error}>{t(error)}</li>
  //               ))}
  //             </ul>
  //           </Message>
  //         )}
  //       </Form>
  //       <div className='button-wrapper'>
  //         <Button secondary className='cancel-button' onClick={closeLocationAndPasswordForms}>
  //           {t('reusable:cta.close')}
  //         </Button>
  //         <Button
  //           id='password-submit-button'
  //           className='submit-button'
  //           disabled={loading}
  //           loading={loading}
  //           onClick={updatePassword}
  //         >
  //           {t('reusable:cta.change')}
  //         </Button>
  //       </div>
  //       <Divider style={{ marginBottom: '2rem' }} />
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default PasswordUpdateForm;
