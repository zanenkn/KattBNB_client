import React from 'react'
import { Header } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'

const Legal = () => {
  const { t } = useTranslation('Legal')
  return (
    <>
      <div className='content-wrapper' style={{ 'marginBottom': '2rem' }}>
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
        <p>
          <Trans i18nKey='Legal:booking.p5'>
          It is Cat Sitter's own responsibility to declare any eventual income generated from fulfilling Services. If you take care for pets as a business activity you may be eligible for approval of Swedish F-tax. <a href='https://skatteverket.se/' target='_blank' rel='noopener noreferrer'>Please refer to Swedish Tax Agency for more information.</a>
          </Trans>
        </p>
        <p>
          <Trans i18nKey='Legal:booking.p6'>
            Cat Sitters who professionally care for cats may need a permit. <a href='https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/djurskyddslag-20181192_sfs-2018-1192' target='_blank' rel='noopener noreferrer'>Please refer to Swedish Animal Welfare Act chapter 6.1 for more information.</a> Users are themselves responsible to determine if they require permit to perform the Service and obtain such permit if necessary.
          </Trans>
        </p>
        <p>{t('Legal:booking.p7')}</p>
        <Header as='h2' >
          {t('Legal:during-service.title')}
        </Header>
        <p>{t('Legal:during-service.p1')}</p>
        <p>{t('Legal:during-service.p2')}</p>
        <p>
          <ul>
            <li>
              <Trans i18nKey='Legal:during-service.li1'>
                attending to Cat Owner's cat(s) at least twice a day according to <a href='https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-20071150-om-tillsyn-over-hundar-och_sfs-2007-1150' target='_blank' rel='noopener noreferrer'>Swedish Law on the supervision of dogs and cats</a>,
              </Trans>
            </li>
            <li>{t('Legal:during-service.li2')}</li>
            <li>{t('Legal:during-service.li3')}</li>
          </ul>
        </p>
        <p>
          <Trans i18nKey='Legal:during-service.p3'>
            It is both Cat Owner's and Cat Sitter's responsibility to examine the cat(s) before Service commences and agree on relevant matters. Users can use <a href='https://kattbnb.se/guidelines' target='_blank' rel='noopener noreferrer'>KattBNB Guidelines</a> to facilitate this agreement.
          </Trans>
        </p>
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
        <p>
          <Trans i18nKey='Legal:personal-data.in-general.p5'>
            KattBNB is responsible to protect your personal data according to the <a href='https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/lag-2018218-med-kompletterande-bestammelser_sfs-2018-218' target='_blank' rel='noopener noreferrer'>Swedish Data Protection act</a>.
          </Trans>
        </p>
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
        <p>
          <Trans i18nKey='Legal:personal-data.in-detail.p9'>
            For a more detailed flow of what happens when Users request an account deletion, please refer to our <a href='https://kattbnb.se/faq' target='_blank' rel='noopener noreferrer'>FAQ page</a>.
          </Trans>
        </p>
        <Header as='h2' >
          {t('Legal:contact-us.title')}
        </Header>
        <p>
          <Trans i18nKey='Legal:contact-us.p1'>
            If you have any questions or suggestions about our Terms, do not hesitate to <a href='https://kattbnb.se/contact-us' target='_blank' rel='noopener noreferrer'>contact us</a>.
          </Trans>
        </p>
      </div>
    </>
  )
}

export default Legal
