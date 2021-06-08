import React, { useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';

const DescriptionUpdateForm = (props) => {
  const { t, ready } = useTranslation('DescriptionUpdateForm');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDescription, setNewDescription] = useState(props.description);

  const updateDescription = () => {
    const lang = detectLanguage();
    setLoading(true);
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
    } else {
      if (newDescription !== '' && newDescription !== props.description) {
        const path = `/api/v1/host_profiles/${props.id}`;
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
            window.alert(t('DescriptionUpdateForm:update-success'));
            props.setElement('description', newDescription);
            props.closeAllForms();
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
        setErrors(['DescriptionUpdateForm:update-error']);
      }
    }
  };

  return <div>a</div>
  // if (ready) {
  //   return (
  //     <>
  //       <Divider />
  //       <p className='small-centered-paragraph'>{t('DescriptionUpdateForm:main-title')}</p>
  //       <Form id='update-description'>
  //         <Form.TextArea
  //           required
  //           id='newDescription'
  //           value={newDescription}
  //           onChange={(e) => setNewDescription(e.target.value)}
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
  //         <Button secondary id='description-close-button' className='cancel-button' onClick={props.closeAllForms}>
  //           {t('reusable:cta:close')}
  //         </Button>
  //         <Button
  //           id='description-submit-button'
  //           className='submit-button'
  //           disabled={loading}
  //           loading={loading}
  //           onClick={() => updateDescription()}
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

export default DescriptionUpdateForm;
