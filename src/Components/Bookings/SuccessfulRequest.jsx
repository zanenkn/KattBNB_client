import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'
import moment from 'moment'

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

    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          Success!
        </Header>
        <Segment className='whitebox' style={{ 'textAlign': 'center' }}>
          <p>
            You have successfully requested a booking for <strong style={{ 'color': '#c90c61' }}>{this.state.numberOfCats} {this.state.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{this.state.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{this.state.checkIn}</strong> until <strong style={{ 'color': '#c90c61' }}>{this.state.checkOut}</strong>.
          </p>
          <p>
            <strong style={{ 'color': '#c90c61' }}>{this.state.nickname}</strong> now has 3 days to accept or decline your request. We will let you know by email. Questions? Check out <Header as={Link} to='faq' className='fake-link-underlined'>our FAQ</Header>.
          </p>
        </Segment>
      </div>
    )
  }
}

export default SuccessfulRequest
