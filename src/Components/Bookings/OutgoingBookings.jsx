import React from 'react'
import { Header, Container } from 'semantic-ui-react'
import moment from 'moment'

const OutgoingBookings = (props) => {
  let requests
  
  if (props.location.state.requests.length > 0) {
    requests = (
      <>
        <Header as='h2' style={{'marginBottom': '0'}}>
          Requests
        </Header>
        <p className='small-centered-paragraph'>
          <strong>
            You have {props.location.state.requests.length} {props.location.state.requests.length > 1 ? 'requests' : 'request'}.
          </strong>
        </p>
        <p style={{'textAlign': 'center'}}>
          These are requests to book you have made awaiting confirmation from host(s).
        </p>
        {props.location.state.requests.map(request => {
          return (
            <Container style={{'backgroundColor': '#e8e8e8', 'marginBottom': '3rem', 'padding': '2rem'}} id={request.id}>
              <p className='small-centered-paragraph'>
                You have requested to book a stay with <strong>{request.host_nickname}</strong> for your <strong>{request.number_of_cats} {request.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(request.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(request.dates[request.dates.length-1]).format('YYYY-MM-DD')}</strong>.
              </p>
              <p className='small-centered-paragraph'>
                You will receive a reply before <strong>{moment(request.created_at).add(3, 'days').format('lll')}</strong>
              </p>
            </Container>
          )
        })}
      </>
    )
  } else {
    requests = (
      <>
        <Header as='h2' style={{'marginBottom': '0'}}>
          Requests
        </Header>
        <p className='small-centered-paragraph'>
          <strong>
            You don't have any booking requests.
          </strong>
        </p>
      </>
    )
  }
  return (
    <div className='expanding-wrapper'>
      <Header as='h1' style={{'marginBottom': '0'}}>
        Outgoing bookings
      </Header>
      <p style={{'textAlign': 'center'}}>
        You booking your cat(s) to stay with hosts.
      </p>
      {requests}


    </div>
  )
}

export default OutgoingBookings
