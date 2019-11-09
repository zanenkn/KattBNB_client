import React from 'react'
import { Link } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'
import moment from 'moment'

const SuccessfulRequest = (props) => {
  let checkIn = moment(props.location.state.checkInDate).format('l')
  let checkOut = moment(props.location.state.checkOutDate).format('l')

  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        Success!
      </Header>
      <Segment className='whitebox'  style={{ 'textAlign': 'center'}}>
        <p>
          You have successfully requested a booking for <strong style={{ 'color': '#c90c61' }}>{props.location.state.numberOfCats} {props.location.state.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{props.location.state.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{checkIn}</strong> until <strong style={{ 'color': '#c90c61' }}>{checkOut}</strong>.
        </p>
        <p>
          <strong style={{ 'color': '#c90c61' }}>{props.location.state.nickname}</strong> now has 3 days to accept or decline your request. We will let you know by email. Questions? Check out <Header as={Link} to='faq' className='fake-link-underlined'>our FAQ</Header>.
        </p>
      </Segment>
    </div>
  )    
}

export default SuccessfulRequest
