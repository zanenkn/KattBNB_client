import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import { Helmet } from 'react-helmet';
import { Header, Text, Container, InlineLink, ContentWrapper } from '../../../UI-Components';
import TeamMemberCard from './TeamMemberCard';
//MIGRATED
const AboutUs = () => {
  const { t, ready } = useTranslation('AboutUs');

  if (!ready) {
    return <Spinner />;
  }

  return (
    <ContentWrapper>
      <Helmet>
        <title>KattBNB - hitta kattvakt nära dig!</title>
        <meta
          name='description'
          content='Letar du efter kattvakt? Då har du kommit rätt. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        />
        <link rel='canonical' href='https://kattbnb.se/about-us' />
        <meta property='og:title' content='KattBNB - hitta kattvakt nära dig!' />
        <meta property='og:url' content='https://kattbnb.se/about-us' />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content='Vi bryr oss om katterna. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
        />
        <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
      </Helmet>
      <Header level={1} color='primary' centered>
        {t('reusable:title.about')}
      </Header>
      <Container space={8}>
        <Header level={3} centered>
          {t('AboutUs:idea-title')}
        </Header>
        <Text>{t('AboutUs:idea-p1')}</Text>
        <Text>{t('AboutUs:idea-p2')}</Text>
        <Text>{t('AboutUs:idea-p3')}</Text>
      </Container>

      <Container space={8}>
        <Header level={3} centered>
          {t('AboutUs:behind-scenes-title')}
        </Header>
        <TeamMemberCard
          img='zane2.png'
          link='https://www.linkedin.com/in/zane-neikena'
          name='Zane Neikena'
          title={t('AboutUs:zane-title')}
          text={t('AboutUs:zane-txt')}
        />
        <TeamMemberCard
          img='george2.png'
          link='https://www.linkedin.com/in/george-tomaras-05833730/'
          name='George Tomaras'
          title={t('AboutUs:george-title')}
          text={t('AboutUs:george-txt')}
        />
        <TeamMemberCard
          img='laura.png'
          link='https://www.linkedin.com/in/realelaura/'
          name='Laura Reale'
          title={t('AboutUs:laura-title')}
          text={t('AboutUs:laura-txt')}
        />
        <TeamMemberCard
          img='joel.png'
          link='https://www.linkedin.com/in/joel-%C3%B6hman-b09307159/'
          name='Joel Öhman'
          title={t('AboutUs:joel-title')}
          text={t('AboutUs:joel-txt')}
        />
      </Container>
      <Container space={8}>
        <Header level={3} centered>
          {t('AboutUs:acknowledgements-title')}
        </Header>
        <Text>
          <Trans i18nKey='AboutUs:acknowledgements-felix'>
            Thank you
            <InlineLink
              color='primary'
              href='https://www.linkedin.com/in/felix-bonnier-90b4561/'
              target='_blank'
              rel='noopener noreferrer'
            >
              Felix Bonnier
            </InlineLink>
            for all the encouragement, advice in business development and the invaluable help with our very first pitch
            deck.
          </Trans>
        </Text>
        <Text>
          <Trans i18nKey='AboutUs:acknowledgements-clarissa'>
            Thank you
            <InlineLink
              color='primary'
              href='https://se.linkedin.com/in/living-and-breathing-tdd'
              target='_blank'
              rel='noopener noreferrer'
            >
              Clarissa Liljander
            </InlineLink>
            for introducing us with i18n solution for translations and helping out with the setup, best of luck with you
            career as a developer!
          </Trans>
        </Text>
      </Container>
    </ContentWrapper>
  );
};

export default AboutUs;
