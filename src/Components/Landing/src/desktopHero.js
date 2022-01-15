import { Link } from 'react-router-dom';

import { Header, Button, Container, Text } from '../../../UI-Components/index';
import { LandingHeroDesktop, HeroTextDesktop, InnerDesktop } from '../styles';

const DesktopHero = ({ t }) => {
  return (
    <LandingHeroDesktop>
      <InnerDesktop>
        <HeroTextDesktop>
          <Header centered color='primary'>
            {t('Landing:title')}
          </Header>
          <Text dangerouslySetInnerHTML={{ __html: t('Landing:text') }} space={6}></Text>
          <Container space={6}>
            <Button as={Link} to='/search' fixedWidth='150px' space={5}>
              {t('Landing:cta-find')}
            </Button>
            <Button
              as={Link}
              to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}
              fixedWidth='150px'
            >
              {t('Landing:cta-become')}
            </Button>
          </Container>
          <Text size='sm' centered tint={80}>
            {t('Landing:photo-credit')}
          </Text>
        </HeroTextDesktop>
      </InnerDesktop>
    </LandingHeroDesktop>
  );
};

export default DesktopHero;
