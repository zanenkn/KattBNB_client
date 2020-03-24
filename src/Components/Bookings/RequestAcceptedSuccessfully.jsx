import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

class RequestAcceptedSuccessfully extends Component {

  componentDidMount() {
    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/all-bookings' })
    }
  }

  render() {

    const { t } = this.props

    if (this.props.tReady) {
      return (
        <div className='content-wrapper'>
          <Header as='h1'>
            {t('RequestAcceptedSuccessfully:title')}
          </Header>
          <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
            <p>
              <Trans i18nKey='RequestAcceptedSuccessfully:desc'>
                You have successfully accepted a booking request. The person who requested this booking has been notified about your decision and has received an access to your full address. You can message them using your Incoming Bookings dashboard. Questions? Check out our <Header as={Link} to='faq' className='fake-link'>FAQ</Header>.
              </Trans>
            </p>
          </Segment>
        </div>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('RequestAcceptedSuccessfully')(RequestAcceptedSuccessfully)
