import React from 'react'
import HostLocationMap from '../HostProfileView/HostLocationMap'

const BookingDetails = (props) => {

  return (
    <div className='expanding-wrapper'>
      <p style={{ 'textAlign': 'center' }}>Your cat is staying with <strong style={{ 'color': '#c90c61' }}>{props.location.state.host}</strong> for <strong style={{ 'color': '#c90c61' }}>{props.location.state.startDate}</strong> until <strong style={{ 'color': '#c90c61' }}>{props.location.state.endDate}</strong>.</p>
      <p style={{ 'textAlign': 'center' }}>The total cost of this stay is <strong style={{ 'color': '#c90c61' }}>{props.location.state.priceTotal} kr</strong></p>
      <p style={{ 'textAlign': 'center' }}>{props.location.state.address}</p>
      <div>
        <HostLocationMap
          lat={props.location.state.lat}
          long={props.location.state.long}
          nickname={props.location.state.nickname}
        />
      </div>
    </div>
  )
}

export default BookingDetails
