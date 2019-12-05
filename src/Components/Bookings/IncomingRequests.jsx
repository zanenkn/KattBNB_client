import React, { Component } from 'react'
import moment from 'moment'
import { Segment, Header, Grid, Icon } from 'semantic-ui-react'
import Popup from 'reactjs-popup'
import IncRequestPopup from './IncRequestPopup'
import DeclineRequestPopup from './DeclineRequestPopup'

class IncomingRequests extends Component {

  render() {
    let sortedRequests = this.props.requests
    sortedRequests.sort((a, b) => ((new Date(b.created_at)).getTime()) - ((new Date(a.created_at)).getTime()))
    let priceWithDecimalsString, total, requestsToDisplay

    if (this.props.requests.length > 0) {
      requestsToDisplay = (
        <>
          <p className='small-centered-paragraph'>
            <strong>
              You have received {this.props.requests.length} booking {this.props.requests.length > 1 ? 'requests' : 'request'}.
            </strong>
          </p>
          <p style={{ 'textAlign': 'center' }}>
            These are booking requests from cat owners awaiting your decision.
          </p>
          {sortedRequests.map(request => {
            priceWithDecimalsString = request.price_total.toFixed(2)
            if (priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' && priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0') {
              total = parseFloat(priceWithDecimalsString)
            } else {
              total = priceWithDecimalsString
            }
            return (
              <Segment className='whitebox' data-cy='incoming-requests' key={request.id}>
                <Grid className='topbox'>
                  <Grid.Row style={{ 'alignItems': 'center' }} >
                    <Grid.Column width={8}>
                      <Header as='h2' style={{ 'color': 'white', 'marginBottom': '0', 'textAlign': 'left' }}>{total} kr</Header>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Popup modal trigger={
                        <Icon name='plus circle' style={{ 'color': '#ffffff', 'opacity': '0.6', 'transform': 'rotate(45deg)', 'float': 'right' }} size='big' />
                      }
                        position="top center"
                        closeOnDocumentClick={true}
                      >
                        <DeclineRequestPopup
                          id={request.id}
                          nickname={request.user.nickname}
                          startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                          endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                        />
                      </Popup>
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
                <Popup modal trigger={
                  <p className='fake-link-underlined'>
                    View message
                  </p>
                }
                  position="top center"
                  closeOnDocumentClick={true}
                >
                  <IncRequestPopup
                    nickname={request.user.nickname}
                    number_of_cats={request.number_of_cats}
                    startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                    endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                    message={request.message}
                    avatar={request.user.avatar}
                  />
                </Popup>
              </Segment>
            )
          })}
        </>
      )
    } else {
      requestsToDisplay = (
        <>
          <p className='small-centered-paragraph'>
            <strong>
              You don't have any booking requests.
            </strong>
          </p>
        </>
      )
    }

    return (
      <>
        {requestsToDisplay}
      </>
    )
  }
}

export default IncomingRequests
