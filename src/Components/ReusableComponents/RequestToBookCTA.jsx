import React from 'react'
import { Button, Header } from 'semantic-ui-react'
import moment from 'moment'

const RequestToBookCTA = (numberOfCats, nickname, checkInDate, checkOutDate, orderTotal, requestToBookButtonClick) => {

  return (
    <>
      <p className='small-centered-paragraph' style={{ 'marginBottom': '0.5rem' }}>
        The stay for <strong style={{ 'color': '#c90c61' }}>{numberOfCats} {numberOfCats > 1 ? 'cats' : 'cat'}</strong> with <strong style={{ 'color': '#c90c61' }}>{nickname}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{moment(checkInDate).format('YYYY-MM-DD')}</strong> until <strong style={{ 'color': '#c90c61' }}>{moment(checkOutDate).format('YYYY-MM-DD')}</strong> would in total cost
      </p>
      <Header id='total' as='h3' style={{ 'marginTop': '0' }}>
        {orderTotal} kr
      </Header>
      <Button
        id='request-to-book'
        style={{ 'marginTop': '0', 'marginBottom': '2rem' }}
        onClick={requestToBookButtonClick}>
        Request to book
      </Button>
    </>
  )
}
export default RequestToBookCTA
