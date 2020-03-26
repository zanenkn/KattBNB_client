import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Accordion, Icon, Label, Button, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const Faq = (props) => {
  const [activeIndex, setActiveIndex] = useState()

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  const { t, ready } = useTranslation('Faq')
  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('reusable:title.faq')}
        </Header>
        <p style={{ 'textAlign': 'center' }}>
          <Trans i18nKey='Faq:to-guidelines'>
            Have you booked a stay already? Check out our helpful <Header as={Link} to='guidelines' className='fake-link-underlined-reg'>guidelines</Header>.
          </Trans>
        </p>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:general.top-header')}
        </Header>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 101}
            index={101}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header1')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 101}>
            <p>
              {t('Faq:general.p1-1')}
            </p>
            <p>
              {t('Faq:general.p1-2')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 102}
            index={102}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header2')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 102}>
            <p>
              {t('Faq:general.p2-1')}
            </p>
            <p>
              <Trans i18nKey='Faq:general.list-title2-1'>
                <strong style={{ 'color': '#c90c61' }}></strong>
              </Trans>
            </p>
            <p>
              <ul>
                <li>
                  <Trans i18nKey='Faq:general.list-item2-1-1'>
                    <strong style={{ 'color': '#c90c61' }}></strong>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey='Faq:general.list-item2-1-2'>
                    <strong style={{ 'color': '#c90c61' }}></strong>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey='Faq:general.list-item2-1-3'>
                    <strong style={{ 'color': '#c90c61' }}></strong>
                  </Trans>
                </li>
              </ul>
            </p>
            <p>
              <Trans i18nKey='Faq:general.list-title2-2'>
                <strong style={{ 'color': '#c90c61' }}></strong>
              </Trans>
            </p>
            <p>
              <ul>
                <li>
                  <Trans i18nKey='Faq:general.list-item2-2-1'>
                    <strong style={{ 'color': '#c90c61' }}></strong>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey='Faq:general.list-item2-2-2'>
                    <strong style={{ 'color': '#c90c61' }}></strong>
                  </Trans>
                </li>
                <li>
                  <Trans i18nKey='Faq:general.list-item2-2-3'>
                    <strong style={{ 'color': '#c90c61' }}></strong>
                  </Trans>
                </li>
              </ul>
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 103}
            index={103}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header3')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 103}>
            <p>
              {t('Faq:general.p3-1')}
            </p>
            <p>
              {t('Faq:general.p3-2')}
            </p>
            <ul>
              <li>{t('Faq:general.list-item3-2-1')}</li>
              <li>{t('Faq:general.list-item3-2-2')}</li>
            </ul>
            <p>
              {t('Faq:general.p3-3')}
            </p>
            <p>
              <Trans i18nKey='Faq:general.p3-4'>
              Please don't hesitate to <Header as={Link} to='contact-us' className='fake-link-underlined-reg'>contact us</Header>...
              </Trans>
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 104}
            index={104}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header4')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 104}>
            <p>
              {t('Faq:general.p4-1')}
            </p>
            <p>
              {t('Faq:general.p4-2')}
            </p>
            <p>
              {t('Faq:general.p4-3')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 105}
            index={105}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header5')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 105}>
            <p>
              {t('Faq:general.p5-1')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 106}
            index={106}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header6')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 106}>
            <p>
              <Trans i18nKey='Faq:general.p6-1'>
                Our website does not use any cookies or other tracking mechanisms. You can read more about what data we collect in our <Header as={Link} to='legal' className='fake-link-underlined-reg'>Terms and conditions</Header>.
              </Trans>
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 107}
            index={107}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:general.sub-header7')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 107}>
            <p>
              {t('Faq:general.p7-1')}
            </p>
            <p>
              {t('Faq:general.p7-2')}
            </p>
            <p>
              {t('Faq:general.p7-3')}
            </p>
          </Accordion.Content>
        </Accordion>

        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:host.top-header')}
        </Header>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 201}
            index={201}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:host.sub-header1')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 201}>
            <p>
              {t('Faq:host.p1-1')}
            </p>
            {props.currentUserIn === false &&
              <a href='https://www.kattbnb.se/sign-up' target='_blank' rel='noopener noreferrer'>
                <Button style={{ 'margin': '1rem auto 1rem' }}>
                  {t('reusable:title.signup')}
                </Button>
              </a>
            }
            <p>
              {t('Faq:host.p1-2')}
            </p>
            {props.currentUserIn &&
              <a href='https://www.kattbnb.se/user-page' target='_blank' rel='noopener noreferrer'>
                <Button style={{ 'margin': '1rem auto 1rem' }}>
                  {t('reusable:cta.make-host-profile')}
                </Button>
              </a>
            }
            <p>
              {t('Faq:host.p1-3')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 202}
            index={202}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:host.sub-header2')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 202}>
            <p>
              {t('Faq:host.p2-1')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 203}
            index={203}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:host.sub-header3')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 203}>
            <p>
              {t('Faq:host.p3-1')}
            </p>
            <Segment raised style={{ 'paddingTop': '1rem', 'marginBottom': '1rem' }}>
              <Label ribbon style={{ 'backgroundColor': 'grey', 'color': 'white', 'margin': '0 0 1rem' }}>
                {t('reusable:labels.how-it-works')}
              </Label>
              <p style={{ 'padding': '0 1rem 1rem 1rem', 'textSize': 'small' }}>
                {t('reusable:explain-supplement')}
              </p>
            </Segment>
            <p>
              <Trans i18nKey='Faq:host.p3-2'>
                You can <a href='https://www.kattbnb.se/contact-us' target='_blank' rel='noopener noreferrer'>contact us</a> if you would like an assistance with setting your rates.
              </Trans>
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 204}
            index={204}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:host.sub-header4')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 204}>
            <p>
              {t('Faq:host.p4-1')}
            </p>
            <Segment raised style={{ 'paddingTop': '1rem' }}>
              <Label ribbon style={{ 'backgroundColor': '#c90c61', 'color': 'white', 'margin': '0 0 1rem' }}>
                {t('reusable:labels.coming-soon')}
              </Label>
              <p style={{ 'padding': '0 1rem 1rem 1rem' }}>
                {t('Faq:host.list-item4-1')}
              </p>
            </Segment>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 205}
            index={205}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:host.sub-header5')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 205}>
            <p>
              {t('Faq:host.p5-1')}
            </p>
          </Accordion.Content>
        </Accordion>

        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:owner.top-header')}
        </Header>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 301}
            index={301}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:owner.sub-header1')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 301}>
            <p>
              {t('Faq:owner.p1-1')}
            </p>
            {props.currentUserIn === false &&
              <a href='https://www.kattbnb.se/sign-up' target='_blank' rel='noopener noreferrer'>
                <Button id='sign-up-button' style={{ 'margin': '1rem auto 1rem' }}>
                  {t('reusable:title.signup')}
                </Button>
              </a>
            }
            <p>
              {t('Faq:owner.p1-2')}
            </p>
            <p>
              {t('Faq:owner.p1-3')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 302}
            index={302}
            onClick={handleClick}
            style={{ 'color': 'grey', 'fontWeight': '600' }}
          >
            <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
            {t('Faq:owner.sub-header2')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 302}>
            <p>
              {t('Faq:owner.p2-1')}
            </p>
            <Segment raised style={{ 'paddingTop': '1rem' }}>
              <Label ribbon style={{ 'backgroundColor': '#c90c61', 'color': 'white', 'margin': '0 0 1rem' }}>
                {t('reusable:labels.coming-soon')}
              </Label>
              <ul>
                <li>
                  {t('Faq:owner.list-item2-1')}
                </li>
                <li>
                  {t('Faq:owner.list-item2-2')}
                </li>
              </ul>
            </Segment>
          </Accordion.Content>
        </Accordion>
      </div>
    )
  } else { return <Spinner /> }
}

const mapStateToProps = (state) => {
  return {
    currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn
  }
}

export default connect(mapStateToProps)(Faq)
