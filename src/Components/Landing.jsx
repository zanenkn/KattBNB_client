import React, { useEffect, useState } from 'react'
import KattBNBLogomark from './Icons/KattBNBLogomark'
import Spinner from './ReusableComponents/Spinner'
import { useTranslation } from 'react-i18next'
import { Header, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

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
      <div className={`landing-hero-wrapper ${dimentions}`}>
        <div className='landing-desktop-content'>
          <KattBNBLogomark width={'100px'} />
          <Header as='h1'>{t('Landing:title')}</Header>
          <p style={{ 'textAlign': 'center', 'maxWidth': '300px' }} dangerouslySetInnerHTML={{ __html: t('Landing:text') }}></p>
          <div style={{ 'width': '165px' }}>
            <Link to={'/search'}>
              <Button style={{ 'width': '100%' }}>{t('Landing:cta-find')}</Button>
            </Link>
            <Link to={'/sign-up'}>
              <Button style={{ 'width': '100%' }}>{t('Landing:cta-become')}</Button>
            </Link>
          </div>

        </div>
      </div>
    )
  } else { return <Spinner /> }
}

export default Landing