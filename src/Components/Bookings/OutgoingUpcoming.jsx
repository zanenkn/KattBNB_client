import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'

const OutgoingUpcoming = (props) => {
  if (props.upcoming.length > 0) {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You have {props.upcoming.length} upcoming {props.upcoming.length > 1 ? 'bookings' : 'booking'}.
          </strong>
        </p>
        <p style={{'textAlign': 'center'}}>
          These are finalized bookings coming up soon. Get in touch with these hosts to organize the drop-off and pick-up.
        </p>
        {props.upcoming.map(upcoming => {
          return (
            <Container style={{'backgroundColor': '#e8e8e8', 'marginBottom': '3rem', 'padding': '2rem'}} id={upcoming.id}>
              <p className='small-centered-paragraph'>
                You have successfully booked a stay with <strong>{upcoming.host_nickname}</strong> for your <strong>{upcoming.number_of_cats} {upcoming.number_of_cats > 1 ? 'cats' : 'cat'}</strong> for the dates of <strong>{moment(upcoming.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(upcoming.dates[upcoming.dates.length-1]).format('YYYY-MM-DD')}</strong>.
              </p>
              <p className='fake-link-underlined'>
                View details
              </p>
            </Container>
          )
        })}
      </>
    )
  } else {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You don't have any upcoming bookings.
          </strong>
        </p>
      </>
    )
  }
}

export default OutgoingUpcoming
