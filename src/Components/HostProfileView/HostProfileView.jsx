import React from 'react'
import { Image, Header } from 'semantic-ui-react'
import ReviewScore from '../ReusableComponents/ReviewScore'
import AllReviews from '../Reviews/AllReviews'
import HostLocationMap from '../ReusableComponents/HostLocationMap'
import RequestToBookCTA from '../ReusableComponents/RequestToBookCTA'
import MessageHostCTA from '../ReusableComponents/MessageHostCTA'
import { pricePerDay, priceFor1DayFor1Cat, finalTotal } from '../../Modules/PriceCalculations'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const HostProfileView = (props) => {

  let perDay = pricePerDay(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate)
  let orderTotal = finalTotal(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate)
  let locationAndPrice, sendMessage, requestToBook

  const { t, ready } = useTranslation('HostProfileView')

  if (ready) {
    if (props.location && props.numberOfCats === 0) {
      let totalRate = priceFor1DayFor1Cat(props.rate)
      locationAndPrice = (
        <Header id='per-day' as='h4' style={{ 'marginTop': '0' }}>
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
          &nbsp;{props.location}&ensp;
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
          &nbsp;{totalRate} {t('reusable:price.total-for-1')}
        </Header>
      )
    } else if (props.location) {
      locationAndPrice = (
        <Header id='per-day' as='h4' style={{ 'marginTop': '0' }}>
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
          &nbsp;{props.location}&ensp;
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
          &nbsp;{perDay} {t('reusable:price.per-day')}
        </Header>
      )
    }

    if (props.noMessage !== true) {
      sendMessage = (
        <MessageHostCTA
          nickname={props.nickname}
          messageHost={props.messageHost.bind(this)}
        />
      )
    }

    if (props.requestToBookButtonClick) {
      requestToBook = (
        <div style={{ 'marginTop': '3rem' }}>
          <RequestToBookCTA
            numberOfCats={props.numberOfCats}
            nickname={props.nickname}
            checkInDate={props.checkInDate}
            checkOutDate={props.checkOutDate}
            orderTotal={orderTotal}
            requestToBookButtonClick={props.requestToBookButtonClick.bind(this)}
          />
        </div>
      )
    }

    return (
      <div className='expanding-wrapper' style={{ 'paddingTop': '2rem' }}>
        <Image id='avatar' src={props.avatar === null ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : props.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
        {props.score != null && <ReviewScore score={props.score} height={'1rem'} center={true} displayNumerical={true} />}
        <Header id='nickname' as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
          <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &ensp;{props.nickname}
        </Header>
        {locationAndPrice}
        <p id='description'>
          {props.description}
        </p>
        {sendMessage}
        <Header as='h3' style={{ 'textAlign': 'left', 'margin': '4rem 0px 2rem' }}>
          {t('HostProfileView:reviews-title')}
        </Header>
        <AllReviews
          hostProfileId={props.hostProfileId}
          score={props.score}
        />
        {requestToBook}
        <HostLocationMap
          lat={props.lat}
          long={props.long}
          nickname={props.nickname}
          address={props.address}
        />
        {requestToBook}
      </div>
    )
  } else { return <Spinner /> }
}

export default HostProfileView
