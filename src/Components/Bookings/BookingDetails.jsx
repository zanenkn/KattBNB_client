import React from 'react'

const BookingDetails = (props) => {

  return (
    <>
      <p>Your cat is staying with {props.location.state.host} for {props.location.state.startDate} until {props.location.state.endDate}.</p>
      <p>The total cost of this stay is {props.location.state.priceTotal} kr</p>
    </>
  )
}

export default BookingDetails
