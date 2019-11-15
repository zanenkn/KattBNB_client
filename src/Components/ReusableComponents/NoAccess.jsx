import React from 'react'
import { Container, Icon } from 'semantic-ui-react'

const NoAccess = () => {
  return (
    <Container
      className='content-wrapper'
      textAlign='center'>
      <Icon
        name='stop circle'
        size='massive'
        color='red' />
      <h1> You cannot access this page or the page does not exist! </h1>
    </Container>
  )
}

export default NoAccess
