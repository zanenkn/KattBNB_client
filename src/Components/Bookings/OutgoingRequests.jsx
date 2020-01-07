import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import Popup from 'reactjs-popup'
import OutRequestUserMessagePopup from './OutRequestUserMessagePopup'

const OutgoingRequests = (props) => {
  let sortedRequests = props.requests
  sortedRequests.sort((a, b) => ((new Date(b.created_at)).getTime()) - ((new Date(a.created_at)).getTime()))

  if (props.requests.length > 0) {
    return (
      <>
        <p className='small-centered-paragraph'>
          <strong>
            You have made {props.requests.length} booking {props.requests.length > 1 ? 'requests' : 'request'}.
          </strong>
        </p>
        <p style={{ 'textAlign': 'center' }}>
          These are requests to book you have made awaiting confirmation from host(s).
        </p>
        {sortedRequests.map(request => {
          return (
            <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={request.id} data-cy='outgoing-requests' key={request.id}>
              <p className='small-centered-paragraph'>
                You have requested to book a stay with <strong>{request.host_nickname}</strong> for your <strong>{request.number_of_cats} {request.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong>{moment(request.dates[0]).format('YYYY-MM-DD')}</strong> until <strong>{moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
              </p>
              <p className='small-centered-paragraph'>
                You will receive a reply before <strong>{moment(request.created_at).add(3, 'days').format('YYYY-MM-DD')}</strong>.
              </p>
              <Popup modal trigger={
                <p className='fake-link-underlined'>
                  View your message
                </p>
              }
                position='top center'
                closeOnDocumentClick={true}
              >
                <OutRequestUserMessagePopup
                  id={request.id}
                  nickname={request.user.nickname}
                  message={request.message}
                  avatar={request.user.avatar}
                  startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                  endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                />
              </Popup>
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

export default OutgoingRequests
