import React from 'react'
import { Header, Segment, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NoAccess = () => {
  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        Hello!
      </Header>
      <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
        <p>Don't be a stranger. Please <Header as={Link} to='login' className='fake-link' >log in</Header> to view this section!</p>
      </Segment>
    </div>
  )
}

export default NoAccess
