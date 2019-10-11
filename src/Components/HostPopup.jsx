import React, { Component } from 'react'
import axios from 'axios'
import HostScore from './HostScore'
import { Image, Header, Button } from 'semantic-ui-react'
import moment from 'moment'
import { getBookingLength } from '../Modules/booking'

class HostPopup extends Component {
  state = {
    avatar: '',
    nickname: '',
    rate: '',
    supplement: '',
    location: ''
  }

  async componentDidMount() {
    axios.get(`/api/v1/host_profiles?user_id=${this.props.id}`).then(response => {
      this.setState({
        avatar: response.data[0].user.avatar,
        nickname: response.data[0].user.nickname,
        location: response.data[0].user.location,
        rate: response.data[0].price_per_day_1_cat,
        supplement: response.data[0].supplement_price_per_cat_per_day
      })
    })
  }


  render() {
    let catVar

    if (this.props.numberOfCats > 1) {
      catVar = 'cats'
    } else {
      catVar = 'cat'
    }

    let perDay = (
      parseFloat(this.state.rate) + (parseFloat(this.props.numberOfCats) - 1) * parseFloat(this.state.supplement)
    )

    let total = (
      parseFloat(perDay) * parseFloat(getBookingLength(this.props.checkInDate, this.props.checkOutDate))
    )


    return (
      <>
        <Image src={this.state.avatar === null ? `https://ui-avatars.com/api/?name=${this.state.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : this.state.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
        <HostScore />
        <Header as='h3' style={{ 'marginTop': '1rem' }}>
          <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &ensp;{this.state.nickname}
        </Header>
        <Header as='h4' style={{ 'color': 'grey', 'marginTop': '0' }}>
          <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &nbsp;{this.state.location}&ensp;
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
          &nbsp;{perDay}
        </Header>
        <Header className='fake-link-underlined' style={{ 'marginTop': '0!important' }}>
          More
        </Header>
        <p className='small-centered-paragraph'>
          The stay for <strong style={{ 'color': '#c90c61' }}>{this.props.numberOfCats} {catVar}</strong> with <strong style={{ 'color': '#c90c61' }}>{this.state.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{moment(this.props.checkInDate).format('YYYY-MM-DD')} - {moment(this.props.checkOutDate).format('YYYY-MM-DD')}</strong> would in total cost
        </p>
        <Header as='h3' style={{ 'marginTop': '0' }}>
          {total} kr
        </Header>
        <Button style={{ 'marginTop': '0' }}>
          Request to book
        </Button>
      </>
    )
  }
}

export default HostPopup
