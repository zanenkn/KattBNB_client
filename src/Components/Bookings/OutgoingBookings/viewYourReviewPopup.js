import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Popup from 'reactjs-popup';
import { Trans, useTranslation } from 'react-i18next';
import axios from 'axios';
import Spinner from '../../../common/Spinner';
import ReviewScore from '../../../common/ReviewScore';
import { PopupHeaderWrapper, FlexWrapper, ScrollWrapper } from '../common/styles';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import useCurrentScope from '../../../hooks/useCurrentScope';
import { Header, Text, Avatar, Divider, Notice } from '../../../UI-Components';

const ViewYourReviewPopup = ({ id, open, onClose, startDate, endDate }) => {
  const { t, ready } = useTranslation('ViewYourReviewPopup');
  const { locale } = useCurrentScope();
  moment.locale(locale);

  const [nickname, setNickname] = useState(null);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);
  const [reviewDate, setReviewDate] = useState(null);
  const [score, setScore] = useState(null);
  const [hostReply, setHostReply] = useState(null);
  const [hostAvatar, setHostAvatar] = useState(null);
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
      const callParams = {
        locale: locale,
      };
      axios
        .get(path, { params: callParams, headers: headers })
        .then((resp) => {
          setNickname(resp.data.host_nickname);
          setMessage(resp.data.body);
          setReviewDate(resp.data.created_at);
          setScore(resp.data.score);
          setHostReply(resp.data.host_reply);
          setHostAvatar(resp.data.host_avatar);
          setReviewUpdatedAt(resp.data.updated_at);
        })
        .catch(({ response }) => {
          if (response === undefined || response.status === 500) {
            setErrors(['reusable:errors:unknown']);
          }
          if (response.status === 401) {
            window.alert(t('reusable:errors:401'));
            wipeCredentials('/login');
          }
          setErrors(response.data.errors);
        });
    }
    // eslint-disable-next-line
  }, []);

  if (!ready) return <Spinner />;

  if (errors) {
    return (
      <Notice nature='danger'>
        <ul>
          {errors.map((error) => (
            <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
          ))}
        </ul>
      </Notice>
    );
  }

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Header level={3} color='white' space={2}>
          {t('ViewYourReviewPopup:main-header')}
        </Header>
        <Text color='white'>
          <Trans i18nKey='ViewYourReviewPopup:desc'>
            You reviewed your booking with <strong>{{ nickname: nickname }}</strong> for the dates of
            <strong>{{ startDate: startDate }}</strong> until <strong>{{ endDate: endDate }}</strong>.
          </Trans>
        </Text>
      </PopupHeaderWrapper>
      <ReviewScore score={score} displayNumerical={true} primaryColor={'primary'} secondaryColor={'neutral'} />
      <Header level={5}>{t('ViewYourReviewPopup:you-said')}</Header>
      <Text size='sm'>{moment(reviewDate).fromNow()}</Text>
      <ScrollWrapper>
        <Text italic>{message}</Text>
      </ScrollWrapper>
      {hostReply && (
        <>
          <Divider />
          <FlexWrapper>
            <Avatar
              size='sm'
              src={
                hostAvatar === null
                  ? `https://ui-avatars.com/api/?name=${nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
                  : hostAvatar
              }
            />
            <Header level={5}>{nickname}</Header>
          </FlexWrapper>
          <Text size='sm'>{moment(reviewUpdatedAt).fromNow()}</Text>

          <Text italic>{hostReply}</Text>
        </>
      )}
    </Popup>
  );
};

export default ViewYourReviewPopup;
