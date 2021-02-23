import React, { useCallback, useState, useRef } from 'react';
import KattBNBLogomark from './Icons/KattBNBLogomark';
import Spinner from './ReusableComponents/Spinner';
import { useTranslation, Trans } from 'react-i18next';
import { Header, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FacebookIcon from './Icons/FacebookIcon';
import InstagramIcon from './Icons/InstagramIcon';
import LinkedinIcon from './Icons/LinkedinIcon';
import { config } from '../weekly-cat-config';
import WeeklyCatBadge from './Icons/WeeklyCatBadge';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Landing = () => {
  const textRef = useRef(null);

  const [carouselWidth, setCarouselWidth] = useState(null);
  const [carouselHeight, setCarouselHeight] = useState(null);

  const { t, ready } = useTranslation('Landing');

  const carouselWrapper = useCallback((node) => {
    const resizeCarousel = () => {
      if (node !== null) {
        let height = node.clientHeight;
        let width = node.clientWidth;
        if (height > width) {
          setCarouselWidth(`${width}px`);
          setCarouselHeight(`${width}px`);
        } else {
          setCarouselWidth(`${height}px`);
          setCarouselHeight(`${height}px`);
        }
      }
    };
    resizeCarousel();
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: textRef.current.getBoundingClientRect().top - 60, behavior: 'smooth' });
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'ease-in',
    speed: 400,
    lazyLoad: 'progressive',
  };

  if (ready) {
    return (
      <>
        <Helmet>
          <title>KattBNB - kattvakt online!</title>
          <meta
            name='description'
            content='Att hitta en kattvakt du kan lita på är ingen enkel uppgift. Vi är här för att hjälpa dig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
          />
          <link rel='canonical' href='https://kattbnb.se' />
          <meta property='og:title' content='KattBNB - kattvakt online!' />
          <meta property='og:url' content='https://kattbnb.se' />
          <meta property='og:type' content='website' />
          <meta
            property='og:description'
            content='Att hitta en kattvakt du kan lita på är ingen enkel uppgift. Vi är här för att hjälpa dig. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
          />
          <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
        </Helmet>
        <div style={{ backgroundColor: '#fafafa' }}>
          <div className='landing-wrapper'>
            <div className='landing-carousel device-height'>
              <div ref={carouselWrapper} className='carousel-outer-wrapper'>
                <div
                  className='carousel-inner-wrapper'
                  style={{ width: carouselWidth, height: carouselHeight, position: 'relative' }}
                >
                  <WeeklyCatBadge className='badge' />
                  <div className='name-wrapper'>
                    <h2 className='title'>{t('Landing:weekly-cat', { count: config.count })}</h2>
                    <h2 className='name'>{config.name}</h2>
                  </div>
                  <Slider {...settings}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((number) => (
                      <img src={`weekly/weekly_${number}.jpg`} key={`weekly_cat_${number}`} alt={`weekly cat ${number}`} />
                    ))}
                  </Slider>
                </div>
              </div>
              <div className='mobile-only' style={{ width: '165px' }}>
                <div>
                  <Link to={'/search'}>
                    <Button style={{ width: '100%', marginTop: '0' }}>{t('Landing:cta-find')}</Button>
                  </Link>
                  <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
                    <Button style={{ width: '100%', marginTop: '1rem' }}>{t('Landing:cta-become')}</Button>
                  </Link>
                </div>
                <div className='scroll-down-cta' onClick={() => scrollDown()}>
                  <Icon link={true} name='angle down' size='huge' color='grey' />
                </div>
              </div>
            </div>

            <div ref={textRef} className='landing-text min-device-height'>
              <KattBNBLogomark width={'100px'} />
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
              <div style={{ display: 'flex', justifyContent: 'center', margin: '4rem auto' }}>
                <a
                  href='https://www.facebook.com/kattbnb/'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ margin: '0 0.5rem', cursor: 'pointer' }}
                >
                  <FacebookIcon height={'3rem'} fill={'silver'} class={'some-icon'} />
                </a>
                <a
                  href='https://www.instagram.com/kattbnb'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ margin: '0 0.5rem', cursor: 'pointer' }}
                >
                  <InstagramIcon height={'3rem'} fill={'silver'} class={'some-icon'} />
                </a>
                <a
                  href='https://www.linkedin.com/company/28767809'
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ margin: '0 0.5rem', cursor: 'pointer' }}
                >
                  <LinkedinIcon height={'3rem'} fill={'silver'} class={'some-icon'} />
                </a>
              </div>
              <p style={{ fontSize: 'small', color: '#a5a5a5' }}>
                <Trans i18nKey='Landing:photo-credit'>
                  Photo credit:
                  <a href={config.link} target='_blank' rel='noopener noreferrer'>
                    {{ author: config.credit }}
                  </a>
                </Trans>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default Landing;
