import React from 'react'
import { Header, Segment, Icon, Container } from 'semantic-ui-react'

const WIP = () => {
  return (
    <Segment className='whitebox' >

      <Header as='h4'>
        <Container padded>
          <Icon loading name='cog' style={{ 'color': '#80808069', 'fontSize': '3rem', 'marginBottom': '1rem' }} />
        </Container>
        <Container text padded>
          This section is still a work in progress!
        </Container>
      </Header>

    </Segment>
  )
}

export default WIP
