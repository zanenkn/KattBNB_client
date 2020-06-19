import React from 'react'
import { Header, Image } from 'semantic-ui-react'
import ReviewScore from './ReusableComponents/ReviewScore'
import { pricePerDay, total } from '../Modules/PriceCalculations'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from './ReusableComponents/Spinner'
import { Link } from 'react-router-dom'
import User from './Icons/User'
import Review from './Icons/Review'

const List = (props) => {

  const { t, ready } = useTranslation('List')

  if (ready) {
    return (
      <div style={{ 'padding': '2rem' }} >
        {props.finalAvailableHosts.length === 0 &&
          <Header>
            <Trans i18nKey='List:no-results'>
              Your search did not yield any results! Try <Link className='fake-link'
                style={{ 'textDecoration': 'underline' }}
                to={{
                  pathname: '/',
                  state: {
                    checkInDate: new Date(props.checkInDate),
                    checkOutDate: new Date(props.checkOutDate),
                    location: props.location,
                    numberOfCats: props.numberOfCats
                  }
                }}> changing your search criteria</Link> or go to the map view to find cat sitters in nearby areas.
            </Trans>
          </Header>}

        {props.finalAvailableHosts.length > 0 &&
          props.finalAvailableHosts.map(host => {
            let perDay = pricePerDay(host.price_per_day_1_cat, props.numberOfCats, host.supplement_price_per_cat_per_day)
            let orderTotal = total(host.price_per_day_1_cat, props.numberOfCats, host.supplement_price_per_cat_per_day, props.checkInDate, props.checkOutDate)

            return (
              <div className='list-card' id={host.id} key={host.id}>
                {host.score &&
                  <ReviewScore score={host.score} height={'1rem'} displayNumerical={true} />
                }
                <div style={{ 'margin': '0', 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center' }}>
                  <div style={{ 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center' }}>
                    <Image
                      src={host.user.profile_avatar === null ? `https://ui-avatars.com/api/?name=${host.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : host.user.profile_avatar}
                      style={{ 'borderRadius': '50%', 'margin': 'auto', 'cursor': 'pointer', 'height': '100px' }}
                      id={host.user.id}
                      onClick={props.handleListItemClick}
                    />
                    <p style={{ 'fontSize': 'small', 'marginTop': '0.3rem' }} >
                      <User fill={'grey'} height={'0.8em'} />
                      &ensp;
                        <strong id={host.user.id} onClick={props.handleListItemClick}>
                        {host.user.nickname}
                      </strong>
                    </p>
                  </div>
                  <div style={{ 'padding': '0 0 0 2rem' }}>
                    <div>
                      <Header as='h3' style={{ 'textAlign': 'left', 'marginBottom': '0' }} id={host.user.id} onClick={props.handleListItemClick}>
                        {perDay} {t('reusable:price.per-day')}
                      </Header>
                      <Header as='h5' style={{ 'textAlign': 'left', 'margin': '0' }} id={host.user.id} onClick={props.handleListItemClick}>
                        {orderTotal} {t('reusable:price.total')}
                      </Header>
                      {host.score &&
                        <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'baseline' }}>
                          <Review fill={'grey'} height={'0.8em'} /> &ensp;
                          <p style={{ 'fontSize': 'small' }}>
                            <strong>{t('List:reviews', { count: host.reviews_count })}</strong>
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  } else { return <Spinner /> }
}

export default List
