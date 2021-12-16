import React from 'react';
import Spinner from '../../../common/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';
import { Header, Text, Avatar } from '../../../UI-Components';
import { PopupHeaderWrapper, FlexWrapper } from '../common/styles';
// Completely MIGRATED

const OutRequestUserMessagePopup = ({ open, onClose, startDate, endDate, avatar, nickname, message }) => {
  const { ready } = useTranslation('OutRequestUserMessagePopup');

  if (!ready) return <Spinner />;

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Text color={'white'}>
          <Trans i18nKey='OutRequestUserMessagePopup:main-title'>
            Your booking request for the dates of <strong>{{ startDate: startDate }}</strong> until
            <strong>{{ endDate: endDate }}</strong>.
          </Trans>
        </Text>
      </PopupHeaderWrapper>

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

      <Text italic space={0}>
        {message}
      </Text>
    </Popup>
  );
};

export default OutRequestUserMessagePopup;
