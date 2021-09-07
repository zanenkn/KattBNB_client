import React from 'react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';
import { Header, Text } from '../../UI-Components';
import { PopupHeaderWrapper } from './common/styles';
// Completely MIGRATED

const IncRequestDeclinedPopup = (props) => {
  const { t, ready } = useTranslation('IncRequestDeclinedPopup');

  if (!ready) return <Spinner />;

  return (
    <Popup modal open={props.open} onClose={props.onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Header level={3} color='white' space={2}>
          {t('IncRequestDeclinedPopup:main-header')}
        </Header>
        <Text color={'white'}>
          <Trans i18nKey='IncRequestDeclinedPopup:desc'>
            You declined a booking request from <strong>{{ nickname: props.nickname }}</strong> for the dates of
            <strong>{{ startDate: props.startDate }}</strong> until <strong>{{ endDate: props.endDate }}</strong>.
          </Trans>
        </Text>
      </PopupHeaderWrapper>
      <Text italic space={0}>{props.message}</Text>
    </Popup>
  );
};

export default IncRequestDeclinedPopup;
