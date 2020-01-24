import React from 'react'
import { Header, Segment, Icon, Container } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

const WIP = () => {
  const { t } = useTranslation()
  i18n.loadNamespaces(['WorkInProgress'])
  return (
    <Segment className='whitebox' >
      <Header as='h4'>
        <Container padded>
          <Icon loading name='cog' style={{ 'color': '#80808069', 'fontSize': '3rem', 'marginBottom': '1rem' }} />
        </Container>
        <Container text padded>
          {t('WorkInProgress:message')}
        </Container>
      </Header>
    </Segment>
  )
}

export default WIP
