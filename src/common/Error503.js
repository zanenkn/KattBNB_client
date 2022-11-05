/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Spinner from './Spinner';
import { wipeCredentials } from '../Modules/wipeCredentials';
import { useTranslation } from 'react-i18next';
import { ContentWrapper, Whitebox, Header, Text } from '../UI-Components';

const Error503 = (props) => {
  const { t, ready } = useTranslation('Error503');

  useEffect(() => {
    if (props.location.search !== '?atm') {
      wipeCredentials('/');
    }
  }, []);

  if (!ready) return <Spinner />;
  
  return (
    <ContentWrapper>
      <Header level={1} centered>
        {t('Error503:title')}
      </Header>
      <Whitebox>
        <Text centered>{t('Error503:desc')}</Text>
      </Whitebox>
    </ContentWrapper>
  );
};

export default Error503;
