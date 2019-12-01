import React, { Component } from 'react'
import { Header, Image, Divider } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'

const AboutUs = () => {
  const { t } = useTranslation()
  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        {t('menu.about')}
      </Header>
      <Header as='h2' >
        {t('about.idea-title')}
      </Header>
      <p>
        {t('about.idea-p1')}
      </p>
      <p>
        {t('about.idea-p2')}
      </p>
      <p>
        {t('about.idea-p3')}
      </p>
      <Divider hidden />
      <Divider hidden />
      <Header as='h2'>
        {t('about.behind-scenes-title')}
      </Header>
      <div>
        <Image style={{ 'margin': 'auto' }} src='zane.png' size='small'></Image>
      </div>
      <Header style={{ 'marginBottom': 0 }}>
        <a href='https://www.linkedin.com/in/zane-neikena' target='_blank' rel='noopener noreferrer'>Zane Neikena</a>
      </Header>
      <Header as='h4' style={{ 'marginTop': 0 }}>
        {t('about.zane-title')}
      </Header>
      <p style={{ 'textAlign': 'center' }}>
        {t('about.zane-txt')}
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
        {t('about.george-title')}
      </Header>
      <p style={{ 'textAlign': 'center' }}>
        {t('about.george-txt')}
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
        {t('about.felix-title')}
      </Header>
      <p style={{ 'textAlign': 'center' }}>
        {t('about.felix-txt')}
      </p>
      <Divider hidden />
      <Divider hidden />
      <Header as='h2'>
        {t('about.acknowledgements-title')}
      </Header>
      <p>
        <Trans i18nKey='about.acknowledgements-txt'>
          None of this would be possible without <a href='https://craftacademy.se/english/' target="_blank" rel='noopener noreferrer'>Craft Academy</a>. These people taught us to code and all things beyond that.
        </Trans>
      </p>
    </div>
  )
}

export default AboutUs
