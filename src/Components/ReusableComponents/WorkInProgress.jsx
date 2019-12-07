import React from 'react'
import { Header, Segment, Icon, Container } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const WIP = () => {
  const { t } = useTranslation()
  return (
    <Segment className='whitebox' >
      <Header as='h4'>
        <Container padded>
          <Icon loading name='cog' style={{ 'color': '#80808069', 'fontSize': '3rem', 'marginBottom': '1rem' }} />
        </Container>
        <Container text padded>
          {t('wip.message')}
        </Container>
      </Header>
    </Segment>
  )
}

export default WIP
