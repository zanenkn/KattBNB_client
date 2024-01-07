import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header, Text, Container, InlineLink, ContentWrapper, Whitebox } from '../../UI-Components';

const Unavailable = () => {
  const { t } = useTranslation('Unavailable');
  return (
    <ContentWrapper>
      <Whitebox>
        <Header centered>:-(</Header>
        <Text centered>{t('Unavailable:text')}</Text>
      </Whitebox>
    </ContentWrapper>
  )
}

export default Unavailable;