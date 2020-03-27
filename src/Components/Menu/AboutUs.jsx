import React from 'react'
import { Header, Image, Divider } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const AboutUs = () => {
  const { t, ready } = useTranslation('AboutUs')
  if (ready) {
    return (
      <>
        <div className='content-wrapper' style={{'marginBottom': '2rem'}} >
          <Header as='h1'>
            {t('reusable:title.about')}
          </Header>
        </div>
        <div className='expanding-wrapper' style={{ 'paddingTop': '0' }}>
          <Header as='h2' >
            {t('AboutUs:idea-title')}
          </Header>
          <p>
            {t('AboutUs:idea-p1')}
          </p>
          <p>
            {t('AboutUs:idea-p2')}
          </p>
          <p>
            {t('AboutUs:idea-p3')}
          </p>
          <Divider hidden />
          <Divider hidden />
          <Header as='h2'>
            {t('AboutUs:behind-scenes-title')}
          </Header>
          <div>
            <Image style={{ 'margin': 'auto' }} src='zane2.png' size='small'></Image>
          </div>
          <Header style={{ 'marginBottom': 0 }}>
            <a href='https://www.linkedin.com/in/zane-neikena' target='_blank' rel='noopener noreferrer'>Zane Neikena</a>
          </Header>
          <Header as='h4' style={{ 'marginTop': 0 }}>
            {t('AboutUs:zane-title')}
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            {t('AboutUs:zane-txt')}
          </p>
          <Divider hidden />
          <Divider hidden />
          <div>
            <Image style={{ 'margin': 'auto' }} src='george2.png' size='small'></Image>
          </div>
          <Header style={{ 'marginBottom': 0 }}>
            <a href='https://www.linkedin.com/in/george-tomaras-05833730/' target='_blank' rel='noopener noreferrer'>George Tomaras</a>
          </Header>
          <Header as='h4' style={{ 'marginTop': 0 }}>
            {t('AboutUs:george-title')}
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            {t('AboutUs:george-txt')}
          </p>
          <Divider hidden />
          <Divider hidden />
          <div>
            <Image style={{ 'margin': 'auto' }} src='joel.png' size='small'></Image>
          </div>
          <Header style={{ 'marginBottom': 0 }}>
            <a href='https://www.linkedin.com/in/joel-%C3%B6hman-b09307159/' target='_blank' rel='noopener noreferrer'>Joel Öhman</a>
          </Header>
          <Header as='h4' style={{ 'marginTop': 0 }}>
            {t('AboutUs:joel-title')}
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            {t('AboutUs:joel-txt')}
          </p>
          <Divider hidden />
          <Divider hidden />
          <Header as='h2'>
            {t('AboutUs:acknowledgements-title')}
          </Header>
          <p>
            <Trans i18nKey='AboutUs:acknowledgements-felix'>
              Thank you <a href='https://www.linkedin.com/in/felix-bonnier-90b4561/' target='_blank' rel='noopener noreferrer'>Felix Bonnier</a> for all the encouragement, advice in business development and the invaluable help with our very first pitch deck.
          </Trans>
          </p>
          <Divider hidden />
          <p>
            <Trans i18nKey='AboutUs:acknowledgements-clarissa'>
              Thank you <a href='https://se.linkedin.com/in/living-and-breathing-tdd' target='_blank' rel='noopener noreferrer'>Clarissa Liljander</a> for introducing us with i18n solution for translations and helping out with the setup, best of luck with you career as a developer!
          </Trans>
          </p>
        </div>
      </>
    )
  } else { return <Spinner /> }
}

export default AboutUs
