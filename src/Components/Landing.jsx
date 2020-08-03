import React, { useEffect, useState } from 'react'
import KattBNBLogomark from './Icons/KattBNBLogomark'
import KattBNBLogo from './Icons/KattBNBLogo'
import Spinner from './ReusableComponents/Spinner'
import { useTranslation } from 'react-i18next'
import { Header, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import FacebookIcon from './Icons/FacebookIcon'
import InstagramIcon from './Icons/InstagramIcon'
import LinkedinIcon from './Icons/LinkedinIcon'

const Landing = () => {
  const [dimentions, setDimentions] = useState('mobile')

  const { t, ready } = useTranslation('Landing')

  useEffect(() => {
    window.innerHeight > window.innerWidth ? setDimentions('mobile') : setDimentions('desktop')
    window.addEventListener('resize', () => {
      window.innerHeight > window.innerWidth ? setDimentions('mobile') : setDimentions('desktop')
    })
  }, [])
  if (ready) {
    return (
      <>
        <div className={`device-height landing-hero-wrapper ${dimentions}`}>
          <div className='landing-desktop-content'>
            <KattBNBLogomark width={'100px'} />
            <Header as='h1'>{t('Landing:title')}</Header>
            <p style={{ 'textAlign': 'center', 'maxWidth': '300px' }} dangerouslySetInnerHTML={{ __html: t('Landing:text') }}></p>
            <div style={{ 'width': '165px' }}>
              <Link to={'/search'}>
                <Button style={{ 'width': '100%' }}>{t('Landing:cta-find')}</Button>
              </Link>
              <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
                <Button style={{ 'width': '100%' }}>{t('Landing:cta-become')}</Button>
              </Link>
            </div>
            <div style={{ 'display': 'flex', 'justifyContent': 'center', 'margin': '4rem auto' }}>
              <a href='https://www.facebook.com/kattbnb/' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                <FacebookIcon height={'3rem'} fill={'grey'} class={'some-icon'} />
              </a>
              <a href='https://www.instagram.com/kattbnb' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                <InstagramIcon height={'3rem'} fill={'grey'} class={'some-icon'} />
              </a>
              <a href='https://www.linkedin.com/company/28767809' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                <LinkedinIcon height={'3rem'} fill={'grey'} class={'some-icon'} />
              </a>
            </div>
            <p style={{ 'fontSize': 'small', 'color': '#a5a5a5' }}>
              {t('Landing:photo-credit')}
            </p>
          </div>
          <div className='landing-mobile-content'>
            <KattBNBLogo class={'landing-mobile-logo'} />
            <div style={{ 'width': '165px' }}>
              <div style={{'marginBottom': '1rem'}}>
                <Link to={'/search'}>
                  <Button style={{ 'width': '100%' }}>{t('Landing:cta-find')}</Button>
                </Link>
                <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
                  <Button style={{ 'width': '100%' }}>{t('Landing:cta-become')}</Button>
                </Link>
              </div>
              <div className='scroll-down-cta'>
                <Icon link='#' name='angle down' size='huge' color='grey' />
              </div>
            </div>
          </div>
        </div>
        <div className={`min-device-height ${dimentions}`} style={{ 'alignItems': 'center', 'justifyContent': 'center', 'display': dimentions === 'mobile' ? 'flex' : 'none' }}>
          <div style={{ 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'padding': '3rem 2rem' }}>
            <Header as='h1'>{t('Landing:title')}</Header>
            <p style={{ 'textAlign': 'center', 'maxWidth': '300px' }} dangerouslySetInnerHTML={{ __html: t('Landing:text') }}></p>
            <div style={{ 'width': '165px' }}>
              <Link to={'/search'}>
                <Button style={{ 'width': '100%' }}>{t('Landing:cta-find')}</Button>
              </Link>
              <Link to={window.localStorage.getItem('I18N_LANGUAGE') === 'en' ? '/become-host' : '/bli-kattvakt'}>
                <Button style={{ 'width': '100%' }}>{t('Landing:cta-become')}</Button>
              </Link>
            </div>
            <div style={{ 'display': 'flex', 'justifyContent': 'center', 'margin': '4rem auto' }}>
              <a href='https://www.facebook.com/kattbnb/' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                <FacebookIcon height={'3rem'} fill={'silver'} class={'some-icon'} />
              </a>
              <a href='https://www.instagram.com/kattbnb' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                <InstagramIcon height={'3rem'} fill={'silver'} class={'some-icon'} />
              </a>
              <a href='https://www.linkedin.com/company/28767809' target='_blank' rel='noopener noreferrer' style={{ 'margin': '0 0.5rem', 'cursor': 'pointer' }}>
                <LinkedinIcon height={'3rem'} fill={'silver'} class={'some-icon'} />
              </a>
            </div>
            <p style={{ 'fontSize': 'small', 'color': '#a5a5a5' }}>
              {t('Landing:photo-credit')}
            </p>
          </div>
        </div>
      </>
    )
  } else { return <Spinner /> }
}

export default Landing