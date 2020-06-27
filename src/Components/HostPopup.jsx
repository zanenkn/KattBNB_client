import React from 'react'
import ReviewScore from './ReusableComponents/ReviewScore'
import { Image, Header } from 'semantic-ui-react'
import { pricePerDay, total } from '../Modules/PriceCalculations'
import RequestToBookCTA from './ReusableComponents/RequestToBookCTA'
import { useTranslation } from 'react-i18next'
import User from './Icons/User'
import Location from './Icons/Location'
import Price from './Icons/Price'
import Review from './Icons/Review'
import Spinner from './ReusableComponents/Spinner'

const HostPopup = (props) => {

  const { t, ready } = useTranslation('HostPopup')

  if (ready) {
    let perDay = pricePerDay(props.rate, props.numberOfCats, props.supplement)
    let orderTotal = total(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate)

    return (
      <>
        <Image src={props.avatar === null ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : props.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
        {props.score &&
          <ReviewScore score={props.score} height={'1rem'} center={true} displayNumerical={true} />
        }
        <Header as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
          <User fill={'#c90c61'} height={'0.8em'} />&ensp;{props.nickname}
        </Header>
        <Header as='h4' style={{ 'marginBottom': '0', 'marginTop': '0', 'lineHeight': '150%' }}>
          <span style={{ 'whiteSpace': 'nowrap' }}>
            <Location fill={'grey'} height={'0.8em'} />&nbsp;{props.location}&ensp;
          </span>
          <span style={{ 'whiteSpace': 'nowrap' }}>
            <Price fill={'grey'} height={'0.8em'} />&nbsp;{perDay} {t('reusable:price.per-day')}&ensp;
          </span>
          {props.reviewsCount &&
            <span style={{ 'whiteSpace': 'nowrap' }}>
              <Review fill={'grey'} height={'0.8em'} />&nbsp;{t('reusable:reviews', { count: parseInt(props.reviewsCount) })}
            </span>
          }
        </Header>
        <Header
          onClick={props.handleHostProfileClick}
          className='fake-link-underlined'
          id='more'
          style={{ 'marginTop': '0.5rem', 'marginBottom': '1.5rem', 'textAlign': 'center', 'marginLeft': 'auto', 'marginRight': 'auto', 'display': 'table' }}
        >
          {t('HostPopup:more')}
        </Header>
        <RequestToBookCTA
          numberOfCats={props.numberOfCats}
          nickname={props.nickname}
          checkInDate={props.checkInDate}
          checkOutDate={props.checkOutDate}
          orderTotal={orderTotal}
          requestToBookButtonClick={props.requestToBookButtonClick.bind(this)}
        />
      </>
    )
  } else { return <Spinner /> }
}

export default HostPopup
