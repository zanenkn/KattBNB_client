import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'

const IncomingUpcoming = (props) => {
  let sortedUpcoming = props.upcoming
  sortedUpcoming.sort((a, b) => (b.dates[0] - a.dates[0]))

  if (props.upcoming.length > 0) {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You have {props.upcoming.length} upcoming {props.upcoming.length > 1 ? 'bookings' : 'booking'}.
          </strong>
        </p>
        <p style={{ 'textAlign': 'center' }}>
          These are finalized bookings coming up soon. Get in touch with these cat owners to organize the drop-off and pick-up.
        </p>
        {sortedUpcoming.map(upcoming => {
          return (
            <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={upcoming.id} data-cy='incoming-upcoming' key={upcoming.id}>
              <p className='small-centered-paragraph'>
                You have approved a stay for <strong>{upcoming.user.nickname}'s</strong> <strong>{upcoming.number_of_cats} {upcoming.number_of_cats > 1 ? 'cats' : 'cat'}</strong> for the dates of <strong>{moment(upcoming.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
              </p>
              <p className='fake-link-underlined'>
                Message {upcoming.user.nickname}
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

export default IncomingUpcoming
