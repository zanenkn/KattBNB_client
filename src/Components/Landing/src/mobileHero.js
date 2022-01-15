import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

import { Header, Button, Container, Text } from '../../../UI-Components/index';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LandingHeroMobile, JumpyArrow, HeroTextMobile } from '../styles';
import { CheveronUp } from '../../../icons';

const MobileHero = ({ t, unitHeight, ctaVisible, textRef, scrollDown }) => {
  return (
    <>
      <LandingHeroMobile unit={unitHeight}>
        <LazyLoadImage wrapperClassName='lazy-hero' effect='blur' src={`Kisse_mobile.jpg`} />
        <Container space={4}>
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
        <JumpyArrow onClick={() => scrollDown()} visible={ctaVisible}>
          <CheveronUp tint={60} height={10} />
        </JumpyArrow>
      </LandingHeroMobile>
      <HeroTextMobile ref={textRef}>
        <Header centered color='primary'>
          {t('Landing:title')}
        </Header>
        <Text dangerouslySetInnerHTML={{ __html: t('Landing:text') }}></Text>
        <Button as={Link} to='/search'>
          {t('Landing:cta-find')}
        </Button>
        <Text size='sm' centered tint={60}>
          {t('Landing:photo-credit')}
        </Text>
      </HeroTextMobile>
    </>
  );
};

export default MobileHero;
