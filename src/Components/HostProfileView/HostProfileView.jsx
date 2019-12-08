import React from 'react'
import { Image, Header, Button } from 'semantic-ui-react'
import HostScore from '../ReusableComponents/HostScore'
import Reviews from '../ReusableComponents/Reviews'
import HostLocationMap from '../ReusableComponents/HostLocationMap'
import { pricePerDay, total } from '../../Modules/PriceCalculations'
import moment from 'moment'

const HostProfileView = (props) => {
  let perDay = pricePerDay(props.rate, props.numberOfCats, props.supplement)
  let orderTotal = total(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate)

  return (
    <div className='expanding-wrapper'>
      <Image id='avatar' src={props.avatar === null ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : props.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
      <HostScore />
      <Header id='nickname' as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
        <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
        &ensp;{props.nickname}
      </Header>
      <Header id='per-day' as='h4' style={{ 'marginTop': '0' }}>
        <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
        &nbsp;{props.location}&ensp;
        <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
        &nbsp;{perDay} kr/day
      </Header>
      <p id='description'>
        {props.description}
      </p>
      <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
        The stay for <strong style={{ 'color': '#c90c61' }}>{props.numberOfCats} {props.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{props.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{moment(props.checkInDate).format('YYYY-MM-DD')}</strong> until <strong style={{ 'color': '#c90c61' }}>{moment(props.checkOutDate).format('YYYY-MM-DD')}</strong> would in total cost
      </p>
      <Header id='total' as='h3' style={{ 'marginTop': '0' }}>
        {orderTotal} kr
      </Header>
      <Button
        id='request-to-book'
        style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
        onClick={props.requestToBookButtonClick}>
        Request to book
      </Button>
      <Reviews />
      <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
        The stay for <strong style={{ 'color': '#c90c61' }}>{props.numberOfCats} {props.numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{props.nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{moment(props.checkInDate).format('YYYY-MM-DD')}</strong> until <strong style={{ 'color': '#c90c61' }}>{moment(props.checkOutDate).format('YYYY-MM-DD')}</strong> would in total cost
      </p>
      <Header as='h3' style={{ 'marginTop': '0' }}>
        {orderTotal} kr
      </Header>
      <Button
        id='request-to-book'
        style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
        onClick={props.requestToBookButtonClick}>
        Request to book
      </Button>
      <div>
        <HostLocationMap
          lat={props.lat}
          long={props.long}
          nickname={props.nickname}
        />
      </div>
      <Header as='h3' style={{ 'textAlign': 'left' }}>
        Questions?
      </Header>
      <p>
        You can send a message to <strong style={{ 'color': '#c90c61' }}>{props.nickname}</strong> and find out.
      </p>
      <p className='fake-link-underlined-reg'>
        Send now
      </p>
    </div>
  )
}

export default HostProfileView
