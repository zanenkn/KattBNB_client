import React, { useState, useEffect } from 'react';
import Spinner from '../../ReusableComponents/Spinner';
import ReviewScore from '../../ReusableComponents/ReviewScore';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { detectLanguage } from '../../../Modules/detectLanguage';
import moment from 'moment';
import Popup from 'reactjs-popup';
import { Header, Text, Avatar, Divider, InlineLink, Notice } from '../../../UI-Components';
import { PopupHeaderWrapper, FlexWrapper, ScrollWrapper } from '../common/styles';

const ViewReviewPopup = ({ open, onClose, id, startDate, endDate }) => {
  const { t, ready } = useTranslation('ViewReviewPopup');
  const lang = detectLanguage();
  moment.locale(lang);

  const [nickname, setNickname] = useState(null);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);
  const [reviewDate, setReviewDate] = useState(null);
  const [score, setScore] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [hostReply, setHostReply] = useState(null);
  const [reviewUpdatedAt, setReviewUpdatedAt] = useState(null);

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator']);
    } else {
      const path = `/api/v1/reviews/${id}`;
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      const payload = { locale: lang };
      axios
        .get(path, payload, { headers: headers })
        .then((resp) => {
          if (resp.data.user === null) {
            setNickname('Deleted user');
            setAvatar(
              'https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false'
            );
          } else {
            setNickname(resp.data.user.nickname);
            setAvatar(resp.data.user.profile_avatar);
          }
          setMessage(resp.data.body);
          setReviewDate(resp.data.created_at);
          setScore(resp.data.score);
          setHostReply(resp.data.host_reply);
          setReviewUpdatedAt(resp.data.updated_at);
        })
        .catch((error) => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm');
          } else if (error.response.status === 500) {
            setErrors(['reusable:errors:500']);
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/');
          } else {
            setErrors([error.response.data.error]);
          }
        });
    }
    // eslint-disable-next-line
  }, []);

  if (!ready) return <Spinner />;

  if (errors) {
    return (
      <Notice nature='danger'>
        <Text centered>{t(errors[0])}</Text>
      </Notice>
    );
  }

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Header level={3} color='white' space={2}>
          {t('ViewReviewPopup:main-header')}
        </Header>
        <Text color='white'>
          <Trans i18nKey='ViewReviewPopup:desc'>
            <strong>{{ nickname: nickname }}</strong> left you a review for a booking between the dates of
            <strong>{{ startDate: startDate }}</strong> and <strong>{{ endDate: endDate }}</strong>.
          </Trans>
        </Text>
      </PopupHeaderWrapper>
      <ReviewScore score={score} displayNumerical={true} primaryColor={'primary'} secondaryColor={'neutral'} />
      <FlexWrapper>
        <Avatar
          size='sm'
          src={
            avatar === null
              ? `https://ui-avatars.com/api/?name=${nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
              : avatar
          }
        />
        <Header level={5}>{nickname}</Header>
      </FlexWrapper>
      <Text size='sm'>{moment(reviewDate).fromNow()}</Text>
      <ScrollWrapper>
        <Text italic>{message}</Text>
      </ScrollWrapper>
      {hostReply ? (
        <>
          <Divider />

          <Text size='sm' bold space={2}>
            {t('ViewReviewPopup:you-replied')}
          </Text>
          <Text size='sm'>{moment(reviewUpdatedAt).fromNow()}</Text>

          <Text italic>{hostReply}</Text>
        </>
      ) : (
        <InlineLink as={Link} to={`/user-page/#review-${id}`} id='reply-link' color='info'>
          {t('reusable:cta:reply')}
        </InlineLink>
      )}
    </Popup>
  );
};

export default ViewReviewPopup;
