import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import OutRequestDeclinedPopup from './OutRequestDeclinedPopup'
import OutRequestCancelledPopup from './OutRequestCancelledPopup'
import Popup from 'reactjs-popup'

const OutgoingHistory = (props) => {
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
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='outgoing-history' key={booking.id}>
                <p className='small-centered-paragraph'>
                  <strong>DECLINED REQUEST</strong>
                </p>
                <p className='small-centered-paragraph'>
                  Your request to book a stay with <strong>{booking.host_nickname}</strong> for your <strong>{booking.number_of_cats} {booking.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong> got declined.
                </p>
                <Popup modal trigger={
                  <p className='fake-link-underlined'>
                    View message
                  </p>
                }
                  position='top center'
                  closeOnDocumentClick={true}
                >
                  <OutRequestDeclinedPopup
                    id={booking.id}
                    nickname={booking.host_nickname}
                    message={booking.host_message}
                    avatar={booking.host_avatar}
                    startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                    endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                  />
                </Popup>
              </Container>
            )
          } else if (booking.status === 'canceled') {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='outgoing-history' key={booking.id}>
                <p className='small-centered-paragraph'>
                  <strong>CANCELLED REQUEST</strong>
                </p>
                <p className='small-centered-paragraph'>
                  Your request to book a stay with <strong>{booking.host_nickname}</strong> for your <strong>{booking.number_of_cats} {booking.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(booking.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}</strong> got canceled.
                </p>
                <Popup modal trigger={
                  <p className='fake-link-underlined'>
                    See why
                  </p>
                }
                  position="top center"
                  closeOnDocumentClick={true}
                >
                  <OutRequestCancelledPopup
                    nickname={booking.host_nickname}
                    startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                    endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                  />
                </Popup>
              </Container>
            )
          } else {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='outgoing-history' key={booking.id}>
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
