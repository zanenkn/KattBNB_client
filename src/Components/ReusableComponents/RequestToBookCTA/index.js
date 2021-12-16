import React from 'react';
import moment from 'moment';
import { Trans, useTranslation } from 'react-i18next';
import { Text, Header, Button, Container } from '../../../UI-Components';
import { detectLanguage } from '../../../Modules/detectLanguage';

const RequestToBookCTA = ({cats, hostName, checkInDate, checkOutDate, orderTotal, onClick}) => {
  const { t, ready } = useTranslation();
  const lang = detectLanguage();
  moment.locale(lang);

  return (
    <Container space={0}>
      <Text centered space={4}>
        <Trans i18nKey='reusable:request-cta.txt' count={parseInt(cats)}>
          The stay for <strong>{{ count: cats }} cat</strong> with
          <strong>{{ host: hostName }}</strong> during the dates of
          <strong>{{ checkin: moment(checkInDate).format('MMMM Do') }}</strong>
          until
          <strong>{{ checkout: moment(checkOutDate).format('MMMM Do') }}</strong>
          would in total cost
        </Trans>
      </Text>
      <Header level={4} centered space={4}>
        {orderTotal} kr
      </Header>
      <Button
        id='request-to-book'
        onClick={() => onClick()}
      >
        {t('reusable:request-cta.btn')}
      </Button>
    </Container>
  );
};

export default RequestToBookCTA;
