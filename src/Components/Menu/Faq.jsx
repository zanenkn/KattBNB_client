import React, { useState } from 'react'
import { Header, Accordion, Icon } from 'semantic-ui-react'
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
            style={{'color': 'grey', 'fontWeight': '600'}}
          >
            <Icon name='dropdown' style={{'color': '#c90c61'}} />
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
            style={{'color': 'grey', 'fontWeight': '600'}}
          >
            <Icon name='dropdown' style={{'color': '#c90c61'}} />
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
            style={{'color': 'grey', 'fontWeight': '600'}}
          >
            <Icon name='dropdown' style={{'color': '#c90c61'}} />
            {t('Faq:general.sub-header1')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 201}>
            <p>
              {t('Faq:general.p1-1')}
            </p>
            <p>
              {t('Faq:general.p1-2')}
            </p>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 202}
            index={202}
            onClick={handleClick}
            style={{'color': 'grey', 'fontWeight': '600'}}
          >
            <Icon name='dropdown' style={{'color': '#c90c61'}} />
            {t('Faq:general.sub-header2')}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 202}>
            <p>
              {t('Faq:general.p2-1')}
            </p>
          </Accordion.Content>
        </Accordion>



      </div>
    )
  } else { return <Spinner /> }
}

export default Faq
