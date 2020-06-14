import React from 'react'
import { Header, Grid, Image } from 'semantic-ui-react'
import ReviewScore from './ReusableComponents/ReviewScore'
import { pricePerDay, total } from '../Modules/PriceCalculations'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from './ReusableComponents/Spinner'
import { Link } from 'react-router-dom'

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
                <Grid style={{ 'margin': '0' }}>
                  <Grid.Column width={5} style={{ 'padding': '0', 'margin': 'auto', 'verticalAlign': 'middle', 'display': 'table' }}>
                    <Image
                      src={host.user.profile_avatar === null ? `https://ui-avatars.com/api/?name=${host.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : host.user.profile_avatar}
                      size='small'
                      style={{ 'borderRadius': '50%', 'margin': 'auto', 'marginBottom': '0.5rem', 'cursor': 'pointer' }}
                      id={host.user.id}
                      onClick={props.handleListItemClick}
                    />
                    {host.score != null && <ReviewScore score={host.score} height={'1rem'} center={true}/>}
                  </Grid.Column>
                  <Grid.Column width={11} style={{ 'padding': '0', 'paddingLeft': '1.5rem', 'margin': 'auto' }}>
                    <div>
                      <Header as='h3' style={{ 'textAlign': 'left', 'marginBottom': '0' }} id={host.user.id} onClick={props.handleListItemClick}>
                        {perDay} {t('reusable:price.per-day')}
                      </Header>
                      <Header as='h5' style={{ 'textAlign': 'left', 'margin': '0' }} id={host.user.id} onClick={props.handleListItemClick}>
                        {orderTotal} {t('reusable:price.total')}
                      </Header>
                      <p style={{ 'fontSize': 'small', 'marginTop': '0.3rem' }} >
                        <svg fill='grey' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
                      &ensp;
                        <strong id={host.user.id} onClick={props.handleListItemClick}>
                          {host.user.nickname}
                        </strong>
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            )
          })
        }
      </div>
    )
  } else { return <Spinner /> }
}

export default List
