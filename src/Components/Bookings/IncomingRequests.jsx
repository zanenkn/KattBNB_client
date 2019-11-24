import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'

const IncomingRequests = (props) => {
  let sortedRequests = props.requests
  sortedRequests.sort((a, b) => ((new Date(b.created_at)).getTime()) - ((new Date(a.created_at)).getTime()))

  if (props.requests.length > 0) {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You have received {props.requests.length} booking {props.requests.length > 1 ? 'requests' : 'request'}.
          </strong>
        </p>
        <p style={{ 'textAlign': 'center' }}>
          These are booking requests from cat owners awaiting your decision.
        </p>
        {sortedRequests.map(request => {
          return (
            <Container style={{ 'backgroundColor': '#e8e8e8', 'marginBottom': '3rem', 'padding': '2rem' }} id={request.id} data-cy='incoming-requests' key={request.id}>
              <p className='small-centered-paragraph'>
                <strong>{request.user.nickname}</strong> wants to book a stay for their <strong>{request.number_of_cats} {request.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(request.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
              </p>
              <p className='small-centered-paragraph'>
                You must reply before <strong>{moment(request.created_at).add(3, 'days').format('YYYY-MM-DD')}</strong>.
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
            You don't have any booking requests.
          </strong>
        </p>
      </>
    )
  }
}

export default IncomingRequests
