import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'
import moment from 'moment'
import { Trans, withTranslation } from 'react-i18next'

class SuccessfulRequest extends Component {

  state = {
    checkIn: '',
    checkOut: '',
    numberOfCats: '',
    nickname: ''
  }

  componentDidMount() {
    if (this.props.history.location.state === undefined || this.props.history.action === 'POP') {
      this.props.history.push({ pathname: '/' })
    } else {
      this.setState({
        checkIn: moment(this.props.location.state.checkInDate).format('l'),
        checkOut: moment(this.props.location.state.checkOutDate).format('l'),
        numberOfCats: this.props.location.state.numberOfCats,
        nickname: this.props.location.state.nickname
      })
    }
  }

  render() {
    const { t } = this.props
    if (this.props.tReady) {
      return (
        <div className='content-wrapper' >
          <Header as='h1'>
            {t('SuccessfulRequest:title')}
          </Header>
          <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
            <p>
              <Trans i18nKey='SuccessfulRequest:p1' count={parseInt(this.state.numberOfCats)}>
                You have successfully requested a booking for <strong style={{ 'color': '#c90c61' }}>{{ count: this.state.numberOfCats }} cat</strong> with <strong style={{ 'color': '#c90c61' }}>{{ host: this.state.nickname }}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{{ checkin: this.state.checkIn }}</strong> until <strong style={{ 'color': '#c90c61' }}>{{ checkout: this.state.checkOut }}</strong>.
              </Trans>
            </p>
            <p>
              <Trans i18nKey='SuccessfulRequest:p2'>
                <strong style={{ 'color': '#c90c61' }}>{{ host: this.state.nickname }}</strong> now has 3 days to accept or decline your request. We will let you know by email. Questions? Check out our <Header as={Link} to='faq' className='fake-link'>FAQ</Header>.
              </Trans>
            </p>
          </Segment>
        </div>
      )
    } else { return null }
  }
}

export default withTranslation('SuccessfulRequest')(SuccessfulRequest)
