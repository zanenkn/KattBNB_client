import React from 'react'
import ReviewScore from './ReusableComponents/ReviewScore'
import { Image, Header } from 'semantic-ui-react'
import { pricePerDay, total } from '../Modules/PriceCalculations'
import RequestToBookCTA from './ReusableComponents/RequestToBookCTA'
import { useTranslation } from 'react-i18next'
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
          <ReviewScore score={props.score} height={'1rem'} center={true} displayNumerical={true}/>
        }
        <Header as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
          <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &ensp;{props.nickname}
        </Header>
        <Header as='h4' style={{ 'marginBottom': '0', 'marginTop': '0', 'lineHeight': '150%' }}>
          <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>
          &nbsp;{props.location}&ensp;
          <svg fill='grey' height='0.8em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg>
          &nbsp;{perDay} {t('reusable:price.per-day')}&ensp;
          {props.reviewsCount &&
            <span style={{'whiteSpace': 'nowrap'}}>
              <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                <path d="M24.7,13c0.4-0.3,0.4-0.9,0-1.3l-2-1.6c-0.3-0.2-0.4-0.6-0.3-0.9l0.9-2.4c0.2-0.5-0.1-1-0.6-1.1l-2.5-0.4
                  c-0.3-0.1-0.6-0.3-0.7-0.7L19,2.2c-0.1-0.5-0.6-0.8-1.1-0.6l-2.4,0.9c-0.3,0.1-0.7,0-0.9-0.2L13,0.3c-0.3-0.4-0.9-0.4-1.3,0l-1.6,2
                  C9.9,2.6,9.5,2.7,9.2,2.6L6.8,1.7c-0.5-0.2-1,0.1-1.1,0.6L5.3,4.9C5.3,5.2,5,5.5,4.7,5.5L2.1,6C1.6,6.1,1.3,6.6,1.5,7.1l0.9,2.4
                  c0.1,0.3,0,0.7-0.2,0.9l-1.9,1.7c-0.4,0.3-0.4,0.9,0,1.2l2,1.6c0.3,0.2,0.4,0.6,0.3,0.9l-0.9,2.4c-0.2,0.5,0.1,1,0.6,1.1l2.5,0.4
                  c0.3,0.1,0.6,0.3,0.7,0.7L6,22.9c0.1,0.5,0.6,0.8,1.1,0.6l2.4-0.9c0.3-0.1,0.7,0,0.9,0.2l1.7,2c0.3,0.4,0.9,0.4,1.3,0l1.6-2
                  c0.2-0.3,0.6-0.4,0.9-0.3l2.4,0.9c0.5,0.2,1-0.1,1.1-0.6l0.4-2.5c0.1-0.3,0.3-0.6,0.7-0.7l2.5-0.5c0.5-0.1,0.8-0.6,0.6-1.1l-0.9-2.4
                  c-0.1-0.3,0-0.7,0.2-0.9L24.7,13z M11.2,17.2l-4.9-4.9l1.9-1.9l3.1,3.1l5.7-5.7l1.9,1.9L11.2,17.2z"/>
              </svg>
              &nbsp;{t('HostPopup:reviews', {count: parseInt(props.reviewsCount)})}
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
