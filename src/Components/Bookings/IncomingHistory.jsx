import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'

const IncomingHistory = (props) => {
  let sortedHistory = props.history
  sortedHistory.sort((a, b) => ((new Date(b.updated_at)).getTime()) - ((new Date(a.updated_at)).getTime()))

  if (props.history.length > 0) {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You have {props.history.length} past {props.history.length > 1 ? 'bookings' : 'booking'}.
          </strong>
        </p>
        {sortedHistory.map(booking => {
          if (booking.status === 'declined') {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='incoming-history' key={booking.id}>
                <p className='small-centered-paragraph'>
                  <strong>DECLINED REQUEST</strong>
                </p>
                <p className='small-centered-paragraph'>
                  You declined a booking request from <strong>{booking.user.nickname}</strong> for their <strong>{booking.number_of_cats} {booking.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
                </p>
                <p className='fake-link-underlined'>
                  View message
                </p>
              </Container>
            )
          } else if (booking.status === 'canceled') {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='incoming-history' key={booking.id}>
                <p className='small-centered-paragraph'>
                  <strong>CANCELED REQUEST</strong>
                </p>
                <p className='small-centered-paragraph'>
                  A booking request from <strong>{booking.user.nickname}</strong> for their <strong>{booking.number_of_cats} {booking.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong> got canceled due to no answer from you within 3 days time.
                </p>
              </Container>
            )
          } else {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='incoming-history' key={booking.id}>
                <p className='small-centered-paragraph'>
                  You hosted <strong>{booking.user.nickname}'s</strong> cat(s) during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
                </p>
                <p className='fake-link-underlined'>
                  View review
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

export default IncomingHistory
