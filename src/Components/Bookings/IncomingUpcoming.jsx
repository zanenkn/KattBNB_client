import React, { Component } from 'react'
import moment from 'moment'
import { Container, Message } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Spinner from '../ReusableComponents/Spinner'
import Popup from 'reactjs-popup'
import { withTranslation, Trans } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'

class IncomingUpcoming extends Component {

  state = {
    errorDisplay: false,
    errors: []
  }

  messageUser = (e, userId, userAvatar, userLocation, userNickname) => {
    e.preventDefault()
    const { t } = this.props
    if (window.navigator.onLine === false) {
      this.setState({
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator']
      })
    } else {
      const lang = detectLanguage()
      const path = '/api/v1/conversations'
      const payload = {
        user1_id: this.props.id,
        user2_id: userId,
        locale: lang
      }
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.post(path, payload, { headers: headers })
        .then(response => {
          this.props.history.push({
            pathname: '/conversation',
            state: {
              id: response.data.id,
              user: {
                profile_avatar: userAvatar,
                id: userId,
                location: userLocation,
                nickname: userNickname
              }
            }
          })
        })
        .catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            this.setState({
              errorDisplay: true,
              errors: ['reusable:errors:500']
            })
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'))
            wipeCredentials('/')
          } else {
            this.setState({
              errorDisplay: true,
              errors: error.response.data.error
            })
          }
        })
    }
  }

  render() {
    const { t } = this.props

    if (this.props.tReady) {
      let sortedUpcoming = this.props.upcoming
      sortedUpcoming.sort((a, b) => (a.dates[0] - b.dates[0]))
      let page, errorDisplay

      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative >
            <ul id='message-error-list'>
              {this.state.errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        )
      }

      if (this.props.upcoming.length > 0) {
        page = (
          <>
            <Popup
              modal
              open={this.state.errorDisplay}
              closeOnDocumentClick={true}
              onClose={() => { this.setState({ errorDisplay: false, errors: [] }) }}
              position='top center'
            >
              <div>
                {errorDisplay}
              </div>
            </Popup>
            <p className='small-centered-paragraph'>
              <Trans count={parseInt(this.props.upcoming.length)} i18nKey='IncomingUpcoming:main-title'>
                <strong>You have {{ count: this.props.upcoming.length }} upcoming booking.</strong>
              </Trans>
            </p>
            <p style={{ 'textAlign': 'center' }}>
              {t('IncomingUpcoming:main-desc')}
            </p>
            {sortedUpcoming.map(upcoming => {
              return (
                <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={upcoming.id} data-cy='incoming-upcoming' key={upcoming.id}>
                  <p className='small-centered-paragraph'>
                    <Trans count={parseInt(upcoming.number_of_cats)} i18nKey='IncomingUpcoming:booking-info'>
                      You have approved a stay for <strong>{{ nickname: upcoming.user.nickname }}'s</strong> <strong>{{ count: upcoming.number_of_cats }} cat</strong> for the dates of <strong>{{ startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                    </Trans>
                  </p>
                  <p className='fake-link-underlined' onClick={(e) => this.messageUser(e, upcoming.user_id, upcoming.user.profile_avatar, upcoming.user.location, upcoming.user.nickname)}>
                    {t('IncomingUpcoming:message')} {upcoming.user.nickname}
                  </p>
                </Container>
              )
            })}
          </>
        )
      } else {
        page = (
          <>
            <p className='small-centered-paragraph'>
              <strong>{t('IncomingUpcoming:no-bookings')}</strong>
            </p>
          </>
        )
      }

      return (
        <>
          {page}
        </>
      )
    } else { return <Spinner /> }
  }
}


const mapStateToProps = state => ({ id: state.reduxTokenAuth.currentUser.attributes.id })

export default withTranslation('IncomingUpcoming')(withRouter(connect(mapStateToProps)(IncomingUpcoming)))
