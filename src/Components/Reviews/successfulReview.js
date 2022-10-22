import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ContentWrapper, Whitebox, Text, Header, InlineLink } from '../../UI-Components';

const SuccessfulReview = ( ) => {
  const { t } = useTranslation('LeaveReview');
  return (
    <ContentWrapper>
      <Header centered level={2} color='primary'>
        {t('LeaveReview:successful.title')}
      </Header>
      <Whitebox>
        <Text>{t('LeaveReview:successful.text')}</Text>
        <InlineLink as={Link} to='all-bookings' color='info'>
          {t('LeaveReview:successful.bookings-cta')}
        </InlineLink>
      </Whitebox>
    </ContentWrapper>
  );
};

export default SuccessfulReview;
