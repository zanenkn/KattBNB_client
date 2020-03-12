import React, { useState } from 'react'
import { Header, Accordion, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const Faq = () => {
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
            <p>
              {t('Faq:host.p1-2')}
            </p>
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
            <p>
              {t('Faq:host.p3-2')}
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
            <p>
              {t('Faq:host.list-item4-1')}
            </p>
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
            <p>
              {t('Faq:owner.list-item2-1')}
            </p>
            <Label size='tiny' style={{'backgroundColor': '#c90c61', 'color': 'white', 'margin': '0 0 0.5rem -1rem'}}>
              Coming soon
            </Label>
            <p>
              {t('Faq:owner.list-item2-2')}
            </p>
          </Accordion.Content>

        </Accordion>



      </div>
    )
  } else { return <Spinner /> }
}

export default Faq
