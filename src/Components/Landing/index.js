import { useEffect, useState, useRef } from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Spinner from '../../common/Spinner';
import SEO from '../../common/SEO';
import Responsive from '../../common/Responsive';
import { Header, Button, ContentWrapper, Container, Text } from '../../UI-Components/index';

import 'react-lazy-load-image-component/src/effects/blur.css';
import { LandingHeroMobile, JumpyArrow, HeroTextMobile } from './styles';
import { CheveronUp } from '../../icons';

const Landing = () => {
  const [ctaVisible, setCtaVisible] = useState(true);
  const mobileText = useRef(null);
  const [unitHeight, setUnitHeight] = useState('0px')

  const { t, ready } = useTranslation('Landing');

  const scrollDown = () => {
    window.scrollTo({ top: mobileText.current.getBoundingClientRect().top - 60, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      window.scrollY > 0 ? setCtaVisible(false) : setCtaVisible(true);
    });
    setUnitHeight(document.documentElement.style.getPropertyValue('--vh'))
  }, []);

  if (!ready) return <Spinner page />;

  return (
    <>
      <SEO page='landing' />
      <Responsive displayIn={['mobile']}>
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
        <HeroTextMobile ref={mobileText}>
          <Header centered color='primary'>{t('Landing:title')}</Header>
          <Text dangerouslySetInnerHTML={{ __html: t('Landing:text') }}></Text>
          <Button as={Link} to='/search'>
              {t('Landing:cta-find')}
            </Button>
        </HeroTextMobile>
      </Responsive>
      <div style={{height: '300px', backgroundColor: 'silver'}}>

      </div>

      <Responsive displayIn={['tablet', 'laptop', 'desktop']}>
        <ContentWrapper>hej hej desktop</ContentWrapper>
      </Responsive>
    </>
  );
};

export default Landing;

{
  /* <>

<div className={`device-height landing-hero-wrapper ${dimentions}`}>
  <LazyLoadImage wrapperClassName='lazy-img' effect='blur' src={`Kisse_${dimentions}.jpg`} />
  <div className='landing-desktop-content'>

    <Header as='h1'>{t('Landing:title')}</Header>
    <p
      style={{ textAlign: 'center', maxWidth: '400px' }}
      dangerouslySetInnerHTML={{ __html: t('Landing:text') }}
    ></p>
    <div style={{ width: '165px' }}>
      <Link to={'/search'}>
        <Button style={{ width: '100%' }}>{t('Landing:cta-find')}</Button>
      </Link>
      <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
        <Button style={{ width: '100%' }}>{t('Landing:cta-become')}</Button>
      </Link>
    </div>
   
    <p style={{ fontSize: 'small', color: '#a5a5a5' }}>{t('Landing:photo-credit')}</p>
  </div>
  <div className='landing-mobile-content'>

    <div style={{ width: '165px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to={'/search'}>
          <Button style={{ width: '100%' }}>{t('Landing:cta-find')}</Button>
        </Link>
        <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
          <Button style={{ width: '100%' }}>{t('Landing:cta-become')}</Button>
        </Link>
      </div>
      <div className='scroll-down-cta' onClick={() => scrollDown()} style={{ visibility: ctaVisibility }}>
        <Icon link='#' name='angle down' size='huge' color='grey' /> 
      </div>
    </div>
  </div>
</div>
<div
  ref={mobileText}
  className={`min-device-height ${dimentions}`}
  style={{ alignItems: 'center', justifyContent: 'center', display: dimentions === 'mobile' ? 'flex' : 'none' }}
>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
    <Header as='h1'>{t('Landing:title')}</Header>
    <p
      style={{ textAlign: 'center', maxWidth: '300px' }}
      dangerouslySetInnerHTML={{ __html: t('Landing:text') }}
    ></p>
    <div style={{ width: '165px' }}>
      <Link to={'/search'}>
        <Button style={{ width: '100%' }}>{t('Landing:cta-find')}</Button>
      </Link>
      <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
        <Button style={{ width: '100%' }}>{t('Landing:cta-become')}</Button>
      </Link>
    </div>
   
    <p style={{ fontSize: 'small', color: '#a5a5a5' }}>{t('Landing:photo-credit')}</p>
  </div>
</div>
</> */
}
