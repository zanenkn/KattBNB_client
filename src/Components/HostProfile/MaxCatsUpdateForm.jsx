import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import Spinner from '../../common/Spinner';

const MaxCatsUpdateForm = (props) => {
  const { t, ready } = useTranslation('MaxCatsUpdateForm');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMaxCats, setNewMaxCats] = useState(props.maxCats);

  const updateMaxCats = () => {
    const lang = detectLanguage();
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (newMaxCats !== '' && newMaxCats !== props.maxCats && newMaxCats >= 1) {
        const path = `/api/v1/host_profiles/${props.id}`;
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
            window.alert(t('MaxCatsUpdateForm:update-success'));
            props.setElement('maxCats', newMaxCats);
            props.closeAllForms();
            setErrors([]);
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              setLoading(false);
              setErrors(['reusable:errors:500']);
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'));
              wipeCredentials('/');
            } else {
              setLoading(false);
              setErrors([error.response.data.error]);
            }
          });
      } else {
        setLoading(false);
        setErrors(['reusable:errors:update-number-fields']);
      }
    }
  };
  return <div>a</div>

  // if (ready) {
  //   return (
  //     <>
  //       <Divider />
  //       <p className='small-centered-paragraph'>{t('MaxCatsUpdateForm:main-title')}</p>
  //       <Form id='update-maxCats' style={{ margin: 'auto', maxWidth: '194px' }}>
  //         <Form.Input
  //           required
  //           type='number'
  //           id='newMaxCats'
  //           value={newMaxCats}
  //           onChange={(e) => setNewMaxCats(e.target.value)}
  //           onKeyPress={(e) => {
  //             e.key === 'Enter' && updateMaxCats();
  //           }}
  //         />
  //       </Form>
  //       {errors.length > 0 && (
  //         <Message negative>
  //           <Message.Header style={{ textAlign: 'center' }}>{t('reusable:errors:action-error-header')}</Message.Header>
  //           <ul id='message-error-list'>
  //             {errors.map((error) => (
  //               <li key={error}>{t(error)}</li>
  //             ))}
  //           </ul>
  //         </Message>
  //       )}
  //       <div className='button-wrapper'>
  //         <Button secondary id='maxCats-close-button' className='cancel-button' onClick={props.closeAllForms}>
  //           {t('reusable:cta:close')}
  //         </Button>
  //         <Button
  //           id='maxCats-submit-button'
  //           className='submit-button'
  //           disabled={loading}
  //           loading={loading}
  //           onClick={() => updateMaxCats()}
  //         >
  //           {t('reusable:cta:save')}
  //         </Button>
  //       </div>
  //       <Divider style={{ marginBottom: '2rem' }} />
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default MaxCatsUpdateForm;
