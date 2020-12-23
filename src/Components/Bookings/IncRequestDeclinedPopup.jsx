import React from 'react';
import { Header } from 'semantic-ui-react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';

const IncRequestDeclinedPopup = (props) => {
  const { t, ready } = useTranslation('IncRequestDeclinedPopup');

  if (ready) {
    return (
      <>
        <div style={{ margin: '-2rem -2rem 2rem', background: '#c90c61', padding: '2rem' }}>
          <Header as='h2' style={{ color: '#ffffff', textAlign: 'left' }}>
            {t('IncRequestDeclinedPopup:main-header')}
          </Header>
          <p style={{ color: '#ffffff', fontSize: 'small' }}>
            <Trans i18nKey='IncRequestDeclinedPopup:desc'>
              You declined a booking request from <strong>{{ nickname: props.nickname }}</strong> for the dates of
              <strong>{{ startDate: props.startDate }}</strong> until <strong>{{ endDate: props.endDate }}</strong>.
            </Trans>
          </p>
        </div>
        <p style={{ fontSize: 'small', fontStyle: 'italic', margin: '1rem 0 0' }}>{props.message}</p>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default IncRequestDeclinedPopup;
