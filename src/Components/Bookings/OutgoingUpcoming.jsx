import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

const OutgoingUpcoming = (props) => {

  const { t, ready } = useTranslation('OutgoingUpcoming')

  if (ready) {
    let sortedUpcoming = props.upcoming
    sortedUpcoming.sort((a, b) => (a.dates[0] - b.dates[0]))

    if (props.upcoming.length > 0) {
      return (
        <>
          <p className='small-centered-paragraph'>
            <Trans count={parseInt(props.upcoming.length)} i18nKey='OutgoingUpcoming:main-header'>
              <strong>You have {{ count: props.upcoming.length }} upcoming booking.</strong>
            </Trans>
          </p>
          <p style={{ 'textAlign': 'center' }}>
            {t('OutgoingUpcoming:desc')}
          </p>
          {sortedUpcoming.map(upcoming => {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={upcoming.id} data-cy='outgoing-upcoming' key={upcoming.id}>
                <p className='small-centered-paragraph'>
                  <Trans count={parseInt(upcoming.number_of_cats)} i18nKey='OutgoingUpcoming:upc-desc'>
                    You have successfully booked a stay with <strong>{{ nickname: upcoming.host_nickname }}</strong> for your <strong>{{ count: upcoming.number_of_cats }} cat</strong> for the dates of <strong>{{ startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                  </Trans>
                </p>
                <p
                  className='fake-link-underlined'
                  onClick={() => {
                    const { history } = props
                    history.push({
                      pathname: '/booking-details',
                      state: {
                        hostId: upcoming.host_id,
                        avatar: upcoming.host_avatar,
                        description: upcoming.host_description,
                        nickname: upcoming.host_nickname,
                        startDate: moment(upcoming.dates[0]).format('YYYY-MM-DD'),
                        endDate: moment(upcoming.dates[upcoming.dates.length - 1]).format('YYYY-MM-DD'),
                        priceTotal: upcoming.price_total,
                        address: upcoming.host_full_address,
                        lat: upcoming.host_real_lat,
                        long: upcoming.host_real_long,
                        location: upcoming.host_location,
                        numberOfCats: upcoming.number_of_cats,
                        hostProfileId: upcoming.host_profile_id,
                        score: upcoming.host_profile_score
                      }
                    })
                  }}
                >
                  {t('OutgoingUpcoming:details')}
                </p>
              </Container>
            )
          })}
        </>
      )
    } else {
      return (
        <>
          <p className='small-centered-paragraph'>
            <strong>{t('OutgoingUpcoming:no-upc')}</strong>
          </p>
        </>
      )
    }
  } else { return <Spinner /> }
}

export default withRouter(OutgoingUpcoming)
