import React, { Component } from 'react'
import moment from 'moment'
import { Segment, Header, Grid, Icon, Message } from 'semantic-ui-react'
import Popup from 'reactjs-popup'
import Spinner from '../ReusableComponents/Spinner'
import { withTranslation, Trans } from 'react-i18next'
import IncRequestPopup from './IncRequestPopup'
import DeclineRequestPopup from './DeclineRequestPopup'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { withRouter } from 'react-router-dom'


class IncomingRequests extends Component {
  state = {
    errorDisplay: false,
    errors: '',
    iconsDisabled: false,
    closeOnDocumentClick: true
  }

  componentDidMount() {
    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/all-bookings' })
    }
  }

  declModalCloseState = (state) => {
    this.setState({ closeOnDocumentClick: state })
  }

  acceptRequest = (e) => {
    const { t } = this.props
    const lang = detectLanguage()
    this.setState({ iconsDisabled: true })
    e.preventDefault()
    if (window.navigator.onLine === false) {
      this.setState({
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator'],
        iconsDisabled: false
      })
    } else {
      if (window.confirm(t('IncomingRequests:accept-request'))) {
        const path = `/api/v1/bookings/${e.target.id.split('-')[1]}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const payload = {
          status: 'accepted',
          host_message: 'accepted by host',
          locale: lang
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            const { history } = this.props
            history.push({ pathname: '/request-accepted-success' })
          })
          .catch(error => {
            if (error.response.status === 500) {
              this.setState({
                errorDisplay: true,
                errors: ['reusable:errors:500'],
                iconsDisabled: false
              })
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'))
              wipeCredentials('/')
            } else {
              this.setState({
                errorDisplay: true,
                errors: error.response.data.error,
                iconsDisabled: false
              })
            }
          })
      } else {
        this.setState({ iconsDisabled: false })
      }
    }
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let sortedRequests = this.props.requests
      sortedRequests.sort((a, b) => ((new Date(b.created_at)).getTime()) - ((new Date(a.created_at)).getTime()))
      let priceWithDecimalsString, total, requestsToDisplay, errorDisplay

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative >
            <Message.Header style={{ 'textAlign': 'center' }} >{t('IncomingRequests:main-header-error')}</Message.Header>
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      if (this.props.requests.length > 0) {
        requestsToDisplay = (
          <>
            <p className='small-centered-paragraph'>
              <Trans count={parseInt(this.props.requests.length)} i18nKey='IncomingRequests:requests-to-display'>
                <strong>You have received {{ count: this.props.requests.length }} booking request.</strong>
              </Trans>
            </p>
            <p style={{ 'textAlign': 'center' }}>
              {t('IncomingRequests:requests-desc')}
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
                          <Icon disabled={this.state.iconsDisabled} id='decline' name='plus circle' style={{ 'color': '#ffffff', 'opacity': '0.6', 'transform': 'rotate(45deg)', 'float': 'right', 'cursor': 'pointer' }} size='big' />
                        }
                          position='top center'
                          closeOnDocumentClick={this.state.closeOnDocumentClick}
                        >
                          <DeclineRequestPopup
                            id={request.id}
                            nickname={request.user.nickname}
                            startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                            endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                            declModalCloseState={this.declModalCloseState.bind(this)}
                          />
                        </Popup>
                        <Icon disabled={this.state.iconsDisabled} id={`accept-${request.id}`} onClick={this.acceptRequest} name='check circle' style={{ 'color': '#ffffff', 'float': 'right', 'cursor': 'pointer' }} size='big' />
                      </Grid.Column>
                    </Grid.Row>
                    <div>
                      <p style={{ 'color': '#ffffff', 'fontSize': 'small', 'marginBottom': '1rem', 'marginTop': '-0.5rem' }}>
                        <Trans i18nKey='IncomingRequests:must-reply'>
                          You must reply before <strong>{{ date: moment(request.created_at).add(3, 'days').format('YYYY-MM-DD') }}</strong>
                        </Trans>
                      </p>
                    </div>
                  </Grid>
                  <p className='small-centered-paragraph'>
                    <Trans count={parseInt(request.number_of_cats)} i18nKey='IncomingRequests:book-a-stay'>
                      <strong style={{ 'color': '#c90c61' }}>{{ nickname: request.user.nickname }}</strong> wants to book a stay for their <strong style={{ 'color': '#c90c61' }}>{{ count: request.number_of_cats }} cat</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{{ startDate: moment(request.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong style={{ 'color': '#c90c61' }}>{{ endDate: moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                     </Trans>
                  </p>
                  <Popup modal trigger={
                    <p className='fake-link-underlined'>
                      {t('IncomingRequests:view-message')}
                    </p>
                  }
                    position='top center'
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
              <strong>{t('IncomingRequests:no-requests')}</strong>
            </p>
          </>
        )
      }

      return (
        <>
          {errorDisplay}
          {requestsToDisplay}
        </>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('IncomingRequests')(withRouter(IncomingRequests))
