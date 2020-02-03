import React from 'react'
import { Header, Segment, Icon, Container } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const WIP = () => {
  const { t, ready } = useTranslation('Faq')
  if (ready) {
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
  } else { return <Spinner /> }
}

export default WIP
