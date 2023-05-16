import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';

import Spinner from '../../../common/Spinner';
import { useStartConversation } from '../../../utils/useStartConversation';

import { Header, Text, Avatar, InlineLink, Flexbox } from '../../../UI-Components';
import { PopupHeaderWrapper, FlexWrapper } from '../common/styles';

const IncRequestPopup = ({
  open,
  onClose,
  numberOfCats,
  startDate,
  endDate,
  nickname,
  message,
  avatar,
  bookerId,
  currentUserId,
}) => {
  const { t, ready } = useTranslation('IncRequestPopup');
  const { startConversation } = useStartConversation();

  if (!ready) return <Spinner />;

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Header level={3} color='white' space={2}>
          {t('IncRequestPopup:main-header')}
        </Header>
        <Text color='white'>
          <Trans count={parseInt(numberOfCats)} i18nKey='IncRequestPopup:desc'>
            A stay for <strong>{{ count: numberOfCats }} cat</strong> for the dates of
            <strong>{{ startDate: startDate }}</strong> until <strong>{{ endDate: endDate }}</strong>
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

      <Text italic>{message}</Text>
      <Flexbox horizontalAlign={'right'}>
        <InlineLink color='info' onClick={() => startConversation({ userId1: currentUserId, userId2: bookerId })}>
          {t('IncRequestPopup:question-to-booker', { booker: nickname })}
        </InlineLink>
      </Flexbox>
    </Popup>
  );
};

const mapStateToProps = (state) => ({ currentUserId: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(IncRequestPopup);
