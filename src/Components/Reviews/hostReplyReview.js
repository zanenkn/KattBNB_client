import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { detectLanguage } from '../../Modules/detectLanguage';
import { formValidation, conditions as validate } from '../../Modules/formValidation';

import { ReplyFormWrapper } from './styles';
import { Flexbox, InlineLink, Text, TextArea, Notice, Button } from '../../UI-Components';

const HostReplyReviewForm = ({ reviewId, reload }) => {
  const { t } = useTranslation('HostReplyReview');

  const [replyFormOpen, setReplyFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (window.location.hash !== '') {
      let id = window.location.hash.split('-')[1];
      if (parseInt(id) === reviewId) {
        setReplyFormOpen(true);
      }
    }
    // eslint-disable-next-line
  }, []);

  const validator = formValidation({
    fields: [
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
      {
        condition: validate.nonEmptyString(reply),
        error: 'HostReplyReview:update-error-1',
      },
      {
        condition: reply.length > 1000,
        error: 'HostReplyReview:update-error-2',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const closeButton = () => {
    setReplyFormOpen(false);
    setReply('');
    setErrors([]);
  };

  const hostReplyReview = () => {
    const lang = detectLanguage();
    setLoading(true);

    const path = `/api/v1/reviews/${reviewId}`;
    const payload = {
      host_reply: reply,
      locale: lang,
    };
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        reload(reply);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (error.response.status === 500) {
          setErrors(['reusable:errors.500']);
        } else {
          setErrors([error.response.data.error]);
        }
      });
  };

  return (
    <>
      {!replyFormOpen && (
        <Flexbox horizontalAlign='right' style={{ visibility: replyFormOpen ? 'hidden' : 'visible' }}>
          <InlineLink onClick={() => setReplyFormOpen(true)} color='info'>{t('reusable:cta:reply')}</InlineLink>
        </Flexbox>
      )}

      <ReplyFormWrapper open={replyFormOpen}>
        <TextArea
          space={2}
          required
          id='host-reply'
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          label={t('HostReplyReview:label')}
        />
        <Text size='sm' italic right>
          {t('reusable:remaining-chars')} {1000 - reply.length}
        </Text>
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
          <Button secondary color='neutral' id='host-reply-close-button' onClick={() => closeButton()}>
            {t('reusable:cta.cancel')}
          </Button>
          <Button
            id='host-reply-submit-button'
            color='info'
            loading={loading}
            disabled={loading}
            onClick={() => validator.onSubmit(hostReplyReview)}
          >
            {t('reusable:cta.save')}
          </Button>
        </Flexbox>
      </ReplyFormWrapper>
    </>
  );
};

export default HostReplyReviewForm;
