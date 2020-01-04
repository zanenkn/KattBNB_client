import React from 'react'
import { connect } from 'react-redux'
import { Image, Header } from 'semantic-ui-react'
import HostScore from '../ReusableComponents/HostScore'
import Reviews from '../ReusableComponents/Reviews'
import HostLocationMap from '../ReusableComponents/HostLocationMap'
import RequestToBookCTA from '../ReusableComponents/RequestToBookCTA'
import { pricePerDay, total } from '../../Modules/PriceCalculations'

const HostProfileView = (props) => {
  let perDay = pricePerDay(props.rate, props.numberOfCats, props.supplement)
  let orderTotal = total(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate)
  let locationAndPrice

  // messageHost = (e) => {
  //   e.preventDefault()
  //   const path = '/api/v1/bookings'
  //   const payload = {
  //     number_of_cats: this.props.location.state.numberOfCats,
  //     message: this.state.message,
  //     dates: booking,
  //     host_nickname: this.props.location.state.nickname,
  //     price_per_day: this.state.perDay,
  //     price_total: this.state.orderTotal,
  //     user_id: this.props.id
  //   }
  //   const headers = {
  //     uid: window.localStorage.getItem('uid'),
  //     client: window.localStorage.getItem('client'),
  //     'access-token': window.localStorage.getItem('access-token')
  //   }
  //   axios.post(path, payload, { headers: headers })
  //     .then(() => {
  //       this.props.history.push({
  //         pathname: '/successful-request',
  //         state: {
  //           numberOfCats: this.props.location.state.numberOfCats,
  //           checkInDate: this.props.location.state.checkInDate,
  //           checkOutDate: this.props.location.state.checkOutDate,
  //           nickname: this.props.location.state.nickname
  //         }
  //       })
  //     })
  //     .catch(error => {
  //       this.setState({
  //         loading: false,
  //         errors: error.response.data.error,
  //         errorDisplay: true
  //       })
  //     })
  // }

  

  if (props.location && props.numberOfCats === 0) {
    let priceWithDecimalsString, totalRate
    priceWithDecimalsString = props.rate.toFixed(2)
    if (priceWithDecimalsString[priceWithDecimalsString.length - 1] === '0' && priceWithDecimalsString[priceWithDecimalsString.length - 2] === '0') {
      totalRate = parseFloat(priceWithDecimalsString)
    } else {
      totalRate = priceWithDecimalsString
    }
    locationAndPrice = (
      <Header id='per-day' as='h4' style={{ 'marginTop': '0' }}>
        <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
        &nbsp;{props.location}&ensp;
        <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
        &nbsp;{totalRate} kr/day for 1 cat
      </Header>
    )
  } else if (props.location) {
    locationAndPrice = (
      <Header id='per-day' as='h4' style={{ 'marginTop': '0' }}>
        <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
        &nbsp;{props.location}&ensp;
        <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
        &nbsp;{perDay} kr/day
      </Header>
    )
  }

  return (
    <div className='expanding-wrapper'>
      <Image id='avatar' src={props.avatar === null ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : props.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
      <HostScore />
      <Header id='nickname' as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
        <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
        &ensp;{props.nickname}
      </Header>
      {locationAndPrice}
      <p id='description'>
        {props.description}
      </p>
      {props.requestToBookButtonClick ? (RequestToBookCTA(props.numberOfCats, props.nickname, props.checkInDate, props.checkOutDate, orderTotal, props.requestToBookButtonClick)) : () => { }}
      <Reviews />
      {props.requestToBookButtonClick ? (RequestToBookCTA(props.numberOfCats, props.nickname, props.checkInDate, props.checkOutDate, orderTotal, props.requestToBookButtonClick)) : () => { }}
      <div>
        <HostLocationMap
          lat={props.lat}
          long={props.long}
          nickname={props.nickname}
          address={props.address}
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

const mapStateToProps = state => ({ userId: state.reduxTokenAuth.currentUser.attributes.id })

export default connect(mapStateToProps)(HostProfileView)
