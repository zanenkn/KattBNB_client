import React, { Component } from 'react'
import { Header, Segment } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import AddToCalendar from 'react-add-to-calendar'

class RequestAcceptedSuccessfully extends Component {

  componentDidMount() {
    if (this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/all-bookings' })
    }
  }

  render() {

    const { t } = this.props
    let total

    let priceWithDecimalsString = this.props.location.state.price.toFixed(2)
    if (priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' && priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0') {
      total = parseFloat(priceWithDecimalsString)
    } else {
      total = priceWithDecimalsString
    }

    let event = {
      title: `KattBNB - ${total}kr`,
      description: `Hosting the ${this.props.location.state.cats} cat(s) of ${this.props.location.state.user}`,
      location: t('RequestAcceptedSuccessfully:event-location'),
      startTime: this.props.location.state.inDate,
      endTime: this.props.location.state.outDate
    }
    let items = [
      { google: 'Google' },
      { apple: 'iCal' },
      { outlook: 'Outlook Desktop' }
    ]

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
            <AddToCalendar
              event={event}
              displayItemIcons={false}
              listItems={items}
              buttonLabel={t('RequestAcceptedSuccessfully:calendar-label')}
            />
          </Segment>
        </div>
      )
    } else { return <Spinner /> }
  }
}

export default withTranslation('RequestAcceptedSuccessfully')(RequestAcceptedSuccessfully)
