import React, { useEffect } from 'react'
import { Header } from 'semantic-ui-react'

const LeaveReview = (props) => {

  useEffect(() => {
    if (props.location.state === undefined || props.history.action === 'POP') {
      window.location.replace('/all-bookings')
    }
  }, [props.location.state, props.history.action])

  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        Leave a review
      </Header>
    </div>
  )
}

export default LeaveReview
