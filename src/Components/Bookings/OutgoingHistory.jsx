import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'

const OutgoingHistory = (props) => {
  let history = props.history.concat(props.declined)

  history.sort((a, b) => ((new Date(b.updated_at)).getTime()) - ((new Date(a.updated_at)).getTime()))

  if (history.length > 0) {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You have {history.length} past {history.length > 1 ? 'bookings' : 'booking'}.
          </strong>
        </p>
        {history.map(booking => {
          if (booking.status === 'declined') {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginBottom': '3rem', 'padding': '2rem' }} id={booking.id}>
                <p className='small-centered-paragraph'>
                  <strong>DECLINED REQUEST</strong>
                </p>
                <p className='small-centered-paragraph'>
                  Your request to book a stay with <strong>{booking.host_nickname}</strong> for your <strong>{booking.number_of_cats} {booking.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong> got declined.
                </p>
                <p className='fake-link-underlined'>
                  View message
                </p>
              </Container>
            )
          } else {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginBottom': '3rem', 'padding': '2rem' }} id={booking.id}>
                <p className='small-centered-paragraph'>
                  Your cat(s) stayed with <strong>{booking.host_nickname}</strong> during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
                </p>
                <p className='fake-link-underlined'>
                  View your review
                </p>
              </Container>
            )
          }
        })}
      </>
    )
  } else {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You don't have any past bookings.
          </strong>
        </p>
      </>
    )
  }
}

export default OutgoingHistory
