import React, { Component } from 'react'
import HostScore from './HostScore'
import { Image, Header, Button } from 'semantic-ui-react'
import moment from 'moment'
import { pricePerDay, total } from '../Modules/PriceCalculations'

class HostPopup extends Component {
  render() {
    let perDay = pricePerDay(this.props.rate, this.props.numberOfCats, this.props.supplement)
    let orderTotal = total(this.props.rate, this.props.numberOfCats, this.props.supplement, this.props.checkInDate, this.props.checkOutDate)
    
    return (
      <>
        <Image src={this.props.avatar === null ? `https://ui-avatars.com/api/?name=${this.props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : this.props.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
        <HostScore />
        <Header as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
          <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &ensp;{this.props.nickname}
        </Header>
        <Header as='h4' style={{ 'marginBottom': '0', 'marginTop': '0' }}>
          <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &nbsp;{this.props.location}&ensp;
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
          &nbsp;{perDay} kr/day
        </Header>
        <Header 
          onClick={this.props.handleHostProfileClick} 
          className='fake-link-underlined' 
          id={this.props.id}
          style={{ 'marginTop': '0.5rem', 'marginBottom': '1.5rem', 'textAlign': 'center', 'marginLeft': 'auto', 'marginRight': 'auto', 'display': 'table' }}
        >
          More
        </Header>
        <p className='small-centered-paragraph' style={{'marginBottom': '0.5rem'}}>
          The stay for <strong style={{ 'color': '#c90c61' }}>{this.props.numberOfCats} {this.props.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{this.props.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{moment(this.props.checkInDate).format('YYYY-MM-DD')}</strong> until <strong style={{ 'color': '#c90c61' }}>{moment(this.props.checkOutDate).format('YYYY-MM-DD')}</strong> would in total cost
        </p>
        <Header as='h3' style={{ 'marginTop': '0' }}>
          {orderTotal} kr
        </Header>
        <Button style={{ 'marginTop': '0' }}>
          Request to book
        </Button>
      </>
    )
  }
}

export default HostPopup
