import React from 'react'
import { Header, Image, Divider } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'

const AboutUs = () => {
  const { t } = useTranslation()
  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        {t('reusable:title.about')}
      </Header>
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
        <Image style={{ 'margin': 'auto' }} src='zane.png' size='small'></Image>
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
        <Image style={{ 'margin': 'auto' }} src='george.png' size='small'></Image>
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
        <Image style={{ 'margin': 'auto' }} src='felix.png' size='small'></Image>
      </div>
      <Header style={{ 'marginBottom': 0 }}>
        <a href='https://www.linkedin.com/in/felix-bonnier-90b4561/' target='_blank' rel='noopener noreferrer'>Felix Bonnier</a>
      </Header>
      <Header as='h4' style={{ 'marginTop': 0 }}>
        {t('AboutUs:felix-title')}
      </Header>
      <p style={{ 'textAlign': 'center' }}>
        {t('AboutUs:felix-txt')}
      </p>
      <Divider hidden />
      <Divider hidden />
      <Header as='h2'>
        {t('AboutUs:acknowledgements-title')}
      </Header>
      <p>
        <Trans i18nKey='AboutUs:acknowledgements-txt'>
          None of this would be possible without <a href='https://craftacademy.se/english/' target="_blank" rel='noopener noreferrer'>Craft Academy</a>. These people taught us to code and all things beyond that.
        </Trans>
      </p>
    </div>
  )
}

export default AboutUs
