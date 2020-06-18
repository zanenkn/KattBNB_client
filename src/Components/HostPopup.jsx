import React from 'react'
import ReviewScore from './ReusableComponents/ReviewScore'
import { Image, Header } from 'semantic-ui-react'
import { pricePerDay, total } from '../Modules/PriceCalculations'
import RequestToBookCTA from './ReusableComponents/RequestToBookCTA'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from './ReusableComponents/Spinner'

const HostPopup = (props) => {

  const { t, ready } = useTranslation('HostPopup')

  if (ready) {
    let perDay = pricePerDay(props.rate, props.numberOfCats, props.supplement)
    let orderTotal = total(props.rate, props.numberOfCats, props.supplement, props.checkInDate, props.checkOutDate)

    return (
      <>
        <Image src={props.avatar === null ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : props.avatar} size='small' style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem' }}></Image>
        {props.score != null &&
          <>
            <ReviewScore score={props.score} height={'1rem'} center={true} />
            <p style={{ 'marginBottom': '0', 'fontSize': 'small' }}>{(props.score).toFixed(1)}/5</p>
            <Trans values={{ count: parseInt(props.reviewsCount) }} i18nKey='HostPopup:reviews'>
              <p style={{ 'fontSize': 'small' }}>{{ count: props.reviewsCount }} review</p>
            </Trans>
          </>}
        <Header as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
          <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &ensp;{props.nickname}
        </Header>
        <Header as='h4' style={{ 'marginBottom': '0', 'marginTop': '0' }}>
          <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &nbsp;{props.location}&ensp;
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
          &nbsp;{perDay} {t('reusable:price.per-day')}
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
