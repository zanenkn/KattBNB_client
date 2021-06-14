import React from 'react';
import Spinner from '../../ReusableComponents/Spinner';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Header, Text, Container, Whitebox } from '../../../UI-Components';

const Guidelines = () => {
  const { t, ready } = useTranslation('Guidelines');

  if (!ready) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>KattBNB - att tänka på innan vistelsen</title>
        <meta
          name='description'
          content='Har du hittat den perfekta kattvakt? Grattis! Här har du några viktiga saker att tänka på innan vistelsen.'
        />
        <link rel='canonical' href='https://kattbnb.se/guidelines' />
        <meta property='og:title' content='KattBNB - den ultimata checklistan' />
        <meta property='og:url' content='https://kattbnb.se/guidelines' />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='Vi bryr oss om katterna. Här har vi samlat några viktiga saker du bör fundera på innan din vistelse hos kattvakten.'
        />
        <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
      </Helmet>
      <Container space={8}>
        <Header level={3}>{t('Guidelines:before-stay.title')}</Header>
        <Text>{t('Guidelines:before-stay.p1')}</Text>
        <ul>
          <li>{t('Guidelines:before-stay.list-item1')}</li>
          <li>{t('Guidelines:before-stay.list-item2')}</li>
          <li>{t('Guidelines:before-stay.list-item3')}</li>
          <li>{t('Guidelines:before-stay.list-item4')}</li>
        </ul>
      </Container>
      <Container space={8}>
        <Header level={3}>{t('Guidelines:owner.title')}</Header>
        <Container space={5}>
          <ul>
            <li>{t('Guidelines:owner.list-item1')}</li>
            <li>{t('Guidelines:owner.list-item2')}</li>
            <li>{t('Guidelines:owner.list-item3')}</li>
            <li>{t('Guidelines:owner.list-item4')}</li>
          </ul>
        </Container>
        <Whitebox centered={false} fixedWidth={false} space={0}>
          <Header level={4} color='main'>
            {t('Guidelines:owner.checklist.title')}
          </Header>
          <ul>
            <li>{t('Guidelines:owner.checklist.list-item1')}</li>
            <li>{t('Guidelines:owner.checklist.list-item2')}</li>
            <li>{t('Guidelines:owner.checklist.list-item3')}</li>
            <li>{t('Guidelines:owner.checklist.list-item4')}</li>
            <li>{t('Guidelines:owner.checklist.list-item5')}</li>
          </ul>
          <Text italic>{t('Guidelines:owner.optional.title')}</Text>
          <ul>
            <li>{t('Guidelines:owner.optional.list-item1')}</li>
            <li>{t('Guidelines:owner.optional.list-item2')}</li>
          </ul>
        </Whitebox>
      </Container>
      <Container space={0}>
        <Header level={3}>{t('Guidelines:host.title')}</Header>
        <ul>
          <li>{t('Guidelines:host.list-item1')}</li>
          <li>{t('Guidelines:host.list-item2')}</li>
          <li>{t('Guidelines:host.list-item3')}</li>
          <li>{t('Guidelines:host.list-item4')}</li>
          <li>{t('Guidelines:host.list-item5')}</li>
          <li>{t('Guidelines:host.list-item6')}</li>
          <li>{t('Guidelines:host.list-item7')}</li>
          <li>{t('Guidelines:host.list-item8')}</li>
          <li>{t('Guidelines:host.list-item9')}</li>
        </ul>
      </Container>
    </>
  );
};

export default Guidelines;
