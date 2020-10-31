import React, { Component } from 'react'
import moment from 'moment'
import { Button, Header, Grid, Icon, Message } from 'semantic-ui-react'
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
    closeOnDocumentClick: true,
    payoutsEnabled: false,
    stripeAccountErrors: [],
    stripeAccountId: '',
    stripePendingVerification: false,
    stripeDashboardButtonLoading: false
  }

  fetchStripeAccountDetails = async () => {
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      try {
        const lang = detectLanguage()
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${this.props.requests[0].host_profile_id}&occasion=retrieve`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const response = await axios.get(path, { headers: headers })
        if (!response.data.message) {
          this.setState({
            payoutsEnabled: response.data.payouts_enabled,
            stripeAccountErrors: response.data.requirements.errors,
            stripePendingVerification: response.data.requirements.pending_verification.length > 0 ? true : false
          })
        } else {
          this.setState({ stripeAccountId: null })
        }
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 555) {
          this.setState({
            errorDisplay: true,
            errors: [error.response.data.error]
          })
        } else if (error.response.status === 503) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'))
          wipeCredentials('/')
        } else {
          this.setState({
            errorDisplay: true,
            errors: [error.response.data.error]
          })
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/all-bookings' })
    }
    if (this.props.requests.length > 0) {
      this.fetchStripeAccountDetails()
    }
  }

  declModalCloseState = (state) => {
    this.setState({ closeOnDocumentClick: state })
  }

  acceptRequest = (e, requestData) => {
    e.preventDefault()
    const { t } = this.props
    const lang = detectLanguage()
    this.setState({ iconsDisabled: true })
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
            history.push({
              pathname: '/request-accepted-success',
              state: {
                cats: requestData.number_of_cats,
                inDate: new Date(requestData.dates[0]),
                outDate: new Date(requestData.dates[requestData.dates.length - 1]),
                price: requestData.price_total,
                user: requestData.user.nickname
              }
            })
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              this.setState({
                errorDisplay: true,
                errors: ['reusable:errors:500'],
                iconsDisabled: false
              })
            } else if (error.response.status === 555) {
              window.alert(error.response.data.error)
              this.props.history.push('/all-bookings')
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
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

  fetchStripeDashboardLink = async () => {
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      try {
        this.setState({ stripeDashboardButtonLoading: true })
        const lang = detectLanguage()
        const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${this.props.requests[0].host_profile_id}&occasion=login_link`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const response = await axios.get(path, { headers: headers })
        window.open(response.data.url)
        this.setState({ stripeDashboardButtonLoading: false })
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 555) {
          this.setState({
            errorDisplay: true,
            errors: [error.response.data.error],
            stripeDashboardButtonLoading: false
          })
        } else if (error.response.status === 503) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'))
          wipeCredentials('/')
        } else {
          this.setState({
            errorDisplay: true,
            errors: [error.response.data.error],
            stripeDashboardButtonLoading: false
          })
        }
      }
    }
  }

  render() {
    const { t } = this.props
    const { payoutSuccess, stripeAccountId, stripeAccountErrors, stripeDashboardButtonLoading, stripePendingVerification } = this.state

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
            {stripeAccountId === null ?
              <>
                <p style={{ 'textAlign': 'center', 'marginTop': '2rem', 'fontSize': 'unset' }}>
                  <Trans i18nKey={'reusable:stripe:step-1-text'}>
                    You made a host profile but have not provided us with your payment information. Without that we cannot transfer the money for your gigs! <span className='fake-link-underlined'>Read more on how we handle payments and your information</span>
                  </Trans>
                </p>
                {/* <a href={`https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.REACT_APP_OFFICIAL === 'yes' ? process.env.REACT_APP_STRIPE_CLIENT_ID : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST}&response_type=code&state=${stripeState}&suggested_capabilities[]=transfers&redirect_uri=${redirectStripe}&stripe_user[email]=${email}&stripe_user[country]=SE`}>
                  <Button id='progress-bar-cta'>{t('HostProfileProgressBar:stripe-onboarding-cta')}</Button>
                </a> */}
              </>
              : payoutSuccess ?
                <>
                  <Button onClick={() => this.fetchStripeDashboardLink()} loading={stripeDashboardButtonLoading} disabled={stripeDashboardButtonLoading} id='progress-bar-cta'>{t('reusable:stripe:stripe-dashboard-cta')}</Button>
                </>
                : stripeAccountErrors &&
                <>
                  <p style={{ 'textAlign': 'center', 'marginTop': '2rem', 'fontSize': 'unset' }}>
                    {t('reusable:stripe:step-2-text')}&ensp;
                    {stripePendingVerification ? t('reusable:stripe:step-2-pending') : t('reusable:stripe:step-2-go-to-dashboard')}
                  </p>
                  <Button onClick={() => this.fetchStripeDashboardLink()} loading={stripeDashboardButtonLoading} disabled={stripeDashboardButtonLoading} id='progress-bar-cta'>{t('reusable:stripe:stripe-dashboard-cta')}</Button>
                </>
            }
            {sortedRequests.map(request => {
              priceWithDecimalsString = request.price_total.toFixed(2)
              if (priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' && priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0') {
                total = parseFloat(priceWithDecimalsString)
              } else {
                total = priceWithDecimalsString
              }
              return (
                <div className='booking-request' data-cy='incoming-requests' key={request.id}>
                  <Grid style={{ 'background': '#c90c61', 'margin': '0' }}>
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
                        <Icon
                          disabled={(this.state.iconsDisabled || this.state.payoutsEnabled === false || this.state.payoutsEnabled === undefined) ? true : false}
                          id={`accept-${request.id}`}
                          onClick={(e) => this.acceptRequest(e, request)}
                          name='check circle'
                          style={{ 'color': '#ffffff', 'float': 'right', 'cursor': 'pointer' }}
                          size='big'
                        />
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
                  <div style={{ 'padding': '2rem' }}>
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
                        avatar={request.user.profile_avatar}
                      />
                    </Popup>
                  </div>
                </div>
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
