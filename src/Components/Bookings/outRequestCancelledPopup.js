import React from 'react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { InlineLink, Header, Text } from '../../UI-Components';
import { PopupHeaderWrapper } from './common/styles';

const OutRequestCancelledPopup = ({ open, onClose, startDate, endDate, nickname }) => {
  const { t, ready } = useTranslation('OutRequestCancelledPopup');

  if (!ready) return <Spinner />;

  return (
    <Popup modal open={open} onClose={onClose} position='top center' closeOnDocumentClick={true}>
      <PopupHeaderWrapper>
        <Header level={3} color='white' space={2}>
          {t('OutRequestCancelledPopup:main-header')}
        </Header>

        <Text color={'white'}>
          <Trans i18nKey='OutRequestCancelledPopup:desc'>
            Your booking request for the dates of <strong>{{ startDate: startDate }}</strong> until
            <strong>{{ endDate: endDate }}</strong> got cancelled.
          </Trans>
        </Text>
      </PopupHeaderWrapper>

      <Text>
        <Trans i18nKey='OutRequestCancelledPopup:explanation'>
          Your booking got automatically cancelled due to
          <strong>{{ nickname: nickname }}</strong> not responding for
          3 days.
        </Trans>
      </Text>

      <Text>
        <Trans i18nKey='OutRequestCancelledPopup:try-again'>
          Try to
          <InlineLink as={Link} to='/search' color="info">
            search again
          </InlineLink>
          , we hope you find a perfect host soon!
        </Trans>
      </Text>
    </Popup>
  );
};

export default OutRequestCancelledPopup;
