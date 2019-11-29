import React from 'react'
import moment from 'moment'
import { Segment, Header, Grid, Icon } from 'semantic-ui-react'

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
            <Segment className='whitebox'>
              <Grid className='topbox'>
                <Grid.Row style={{ 'alignItems': 'center' }} >
                  <Grid.Column width={8}>
                    <Header as='h2' style={{ 'color': 'white', 'marginBottom': '0', 'textAlign': 'left' }}>{request.price_total} kr</Header>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Icon name='plus circle' style={{ 'color': '#ffffff', 'opacity': '0.6', 'transform': 'rotate(45deg)', 'float': 'right' }} size='big' />
                    <Icon name='check circle' style={{ 'color': '#ffffff', 'float': 'right' }} size='big' />
                  </Grid.Column>
                </Grid.Row>
                <div>
                  <p style={{ 'color': '#ffffff', 'fontSize': 'small', 'marginBottom': '1rem', 'marginTop': '-0.5rem' }}>
                    You must reply before <strong>{moment(request.created_at).add(3, 'days').format('YYYY-MM-DD')}</strong>
                  </p>
                </div>
              </Grid>
              <p className='small-centered-paragraph'>
                <strong style={{ 'color': '#c90c61' }}>{request.user.nickname}</strong> wants to book a stay for their <strong style={{ 'color': '#c90c61' }}>{request.number_of_cats} {request.number_of_cats > 1 ? 'cats' : 'cat'}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{moment(request.dates[0]).format('YYYY-MM-DD')}</strong> until <strong style={{ 'color': '#c90c61' }}>{moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}</strong>.
              </p>
              <p className='fake-link-underlined'>
                View message
              </p>
            </Segment>
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
