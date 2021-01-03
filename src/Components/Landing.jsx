import React, { useCallback, useState, useRef, createRef } from 'react';
import KattBNBLogomark from './Icons/KattBNBLogomark';
import KattBNBLogo from './Icons/KattBNBLogo';
import Spinner from './ReusableComponents/Spinner';
import { useTranslation } from 'react-i18next';
import { Header, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FacebookIcon from './Icons/FacebookIcon';
import InstagramIcon from './Icons/InstagramIcon';
import LinkedinIcon from './Icons/LinkedinIcon';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Landing = () => {
  const textRef = useRef(null);
  const imageRef = useRef([])

  imageRef.current = Array(10)
    .fill()
    .map((_, i) => imageRef.current[i] || createRef())

  const [carouselWidth, setCarouselWidth] = useState(null)
  const [carouselHeight, setCarouselHeight] = useState(null)

  const { t, ready } = useTranslation('Landing');

  const scrollDown = () => {
    window.scrollTo({ top: textRef.current.getBoundingClientRect().top - 60, behavior: 'smooth' });
  }

  const carouselWrapper = useCallback(
    (node) => {
      const resizeCarousel = () => {
        let height = node.clientHeight
        let width = node.clientWidth
        if (height > width) {
          setCarouselWidth(`${width}px`)
          setCarouselHeight(`${width}px`)
        } else {
          setCarouselWidth(`${height}px`)
          setCarouselHeight(`${height}px`)
        }
      }
      resizeCarousel()

      window.addEventListener('resize', () => {
        resizeCarousel()
      });
    },
    []
  );


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
              <div className='mobile-only'>
                <KattBNBLogo class={'landing-mobile-logo'} />
              </div>
              <div ref={carouselWrapper} className='carousel-outer-wrapper'>
                <div className='carousel-inner-wrapper' style={{ width: carouselWidth, height: carouselHeight }}>
                  <ul className='scroll'>
                    {imageRef.current.map((_, index) => {
                      return (
                        <li
                          className='scroll-item'
                          key={index + 1}
                          ref={imageRef.current[index]}
                        >
                          {index === 0 ?
                            <LazyLoadImage effect='blur' src={`weekly/weekly_${index + 1}.jpg`} width={carouselWidth} height='100%' />
                            :
                            <img src={`weekly/weekly_${index + 1}.jpg`} width={carouselWidth} height='100%'></img>
                          }
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              <div className='mobile-only' style={{ width: '165px' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <Link to={'/search'}>
                    <Button style={{ width: '100%' }}>{t('Landing:cta-find')}</Button>
                  </Link>
                  <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
                    <Button style={{ width: '100%' }}>{t('Landing:cta-become')}</Button>
                  </Link>
                </div>
                <div className='scroll-down-cta' onClick={() => scrollDown()}>
                  <Icon link='#' name='angle down' size='huge' color='grey' />
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
              <p style={{ fontSize: 'small', color: '#a5a5a5' }}>{t('Landing:photo-credit')}</p>
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
