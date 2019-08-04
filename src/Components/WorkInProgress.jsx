import React from 'react'
import { Header, Segment, Icon, Container } from 'semantic-ui-react'

const WIP = () => {
  return (
    <Segment padded compact style={{'margin': 'auto', 'padding': '2rem', 'margin-top': '2rem'}} >

      <Header as='h4'>
        <Container padded>
          <Icon loading name='cog' style={{'color': '#80808069', 'font-size': '3rem', 'margin-bottom': '1rem'}} />
        </Container>
        <Container text padded>
          This section is still a work in progress!
        </Container>
      </Header>

    </Segment>
  )
}

export default WIP