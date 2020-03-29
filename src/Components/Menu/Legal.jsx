import React from 'react'
import { Header } from 'semantic-ui-react'
import WIP from '../ReusableComponents/WorkInProgress'
import { useTranslation } from 'react-i18next'

const Legal = () => {
  const { t } = useTranslation('Legal')
  return (
    <>
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('reusable:title.legal')}
        </Header>
      </div>
      <div className='expanding-wrapper'>
        <Header as='h2' >
          {t('Legal:intro.title')}
        </Header>
        <p>{t('Legal:intro.p1')}</p>
        <p>{t('Legal:intro.p2')}</p>
        <p>{t('Legal:intro.p3')}</p>
        <p>{t('Legal:intro.p4')}</p>
        <p>{t('Legal:intro.p5')}</p>
        <Header as='h2' >
          {t('Legal:registration.title')}
        </Header>
        <p>{t('Legal:registration.p1')}</p>
        <p>
          <ul>
            <li>{t('Legal:registration.li1')}</li>
            <li>{t('Legal:registration.li2')}</li>
            <li>{t('Legal:registration.li3')}</li>
          </ul>
        </p>
        <p>{t('Legal:registration.p2')}</p>
        <Header as='h2' >
          {t('Legal:general.title')}
        </Header>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:general.user-content.title')}
        </Header>
        <p>{t('Legal:general.user-content.p1')}</p>
        <p>{t('Legal:general.user-content.p2')}</p>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:general.abuse-of-app.title')}
        </Header>
        <p>{t('Legal:general.abuse-of-app.p1')}</p>
        <p>{t('Legal:general.abuse-of-app.p2')}</p>
        <p>
          <ul>
            <li>{t('Legal:general.abuse-of-app.li1')}</li>
            <li>{t('Legal:general.abuse-of-app.li2')}</li>
            <li>{t('Legal:general.abuse-of-app.li3')}</li>
            <li>{t('Legal:general.abuse-of-app.li4')}</li>
          </ul>
        </p>
        <p>{t('Legal:general.abuse-of-app.p3')}</p>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:general.liability.title')}
        </Header>
        <p>{t('Legal:general.liability.p1')}</p>
        <p>{t('Legal:general.liability.p2')}</p>
        <p>{t('Legal:general.liability.p3')}</p>
        <p>{t('Legal:general.liability.p4')}</p>
        <p>{t('Legal:general.liability.p5')}</p>
        <p>{t('Legal:general.liability.p6')}</p>
        <Header as='h2' >
          {t('Legal:booking.title')}
        </Header>
        <p>{t('Legal:booking.p1')}</p>
        <p>{t('Legal:booking.p2')}</p>
        <p>{t('Legal:booking.p3')}</p>
        <p>{t('Legal:booking.p4')}</p>
        <p>{t('Legal:booking.p5')}</p>
        <p>{t('Legal:booking.p6')}</p>
        <p>{t('Legal:booking.p7')}</p>
        <Header as='h2' >
          {t('Legal:during-service.title')}
        </Header>
        <p>{t('Legal:during-service.p1')}</p>
        <p>{t('Legal:during-service.p2')}</p>
        <p>
          <ul>
            <li>{t('Legal:during-service.li1')}</li>
            <li>{t('Legal:during-service.li2')}</li>
            <li>{t('Legal:during-service.li3')}</li>
          </ul>
        </p>
        <p>{t('Legal:during-service.p3')}</p>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:during-service.emergency.title')}
        </Header>
        <p>{t('Legal:during-service.emergency.p1')}</p>
        <p>{t('Legal:during-service.emergency.p2')}</p>
        <p>{t('Legal:during-service.emergency.p3')}</p>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:during-service.owner-liability.title')}
        </Header>
        <p>{t('Legal:during-service.owner-liability.p1')}</p>
        <p>{t('Legal:during-service.owner-liability.p2')}</p>
        <Header as='h2' >
          {t('Legal:personal-data.title')}
        </Header>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:personal-data.in-general.title')}
        </Header>
        <p>{t('Legal:personal-data.in-general.p1')}</p>
        <p>{t('Legal:personal-data.in-general.p2')}</p>
        <p>
          <ul>
            <li>{t('Legal:personal-data.in-general.li1')}</li>
            <li>{t('Legal:personal-data.in-general.li2')}</li>
            <li>{t('Legal:personal-data.in-general.li3')}</li>
          </ul>
        </p>
        <p>{t('Legal:personal-data.in-general.p3')}</p>
        <p>{t('Legal:personal-data.in-general.p4')}</p>
        <p>{t('Legal:personal-data.in-general.p5')}</p>
        <p>{t('Legal:personal-data.in-general.p6')}</p>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Legal:personal-data.in-detail.title')}
        </Header>
        <p>{t('Legal:personal-data.in-detail.p1')}</p>
        <p>{t('Legal:personal-data.in-detail.p2')}</p>
        <p>{t('Legal:personal-data.in-detail.p3')}</p>
        <p>{t('Legal:personal-data.in-detail.p4')}</p>
        <p>{t('Legal:personal-data.in-detail.p5')}</p>
        <p>{t('Legal:personal-data.in-detail.p6')}</p>
        <p>{t('Legal:personal-data.in-detail.p7')}</p>
        <p>{t('Legal:personal-data.in-detail.p8')}</p>
        <p>{t('Legal:personal-data.in-detail.p9')}</p>
        <Header as='h2' >
          {t('Legal:contact-us.title')}
        </Header>
        <p>{t('Legal:contact-us.p1')}</p>
      </div>
    </>
  )
}

export default Legal
