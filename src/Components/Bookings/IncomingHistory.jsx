import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import Popup from 'reactjs-popup'
import IncRequestDeclinedPopup from './IncRequestDeclinedPopup'

const IncomingHistory = (props) => {

  const { t, ready } = useTranslation('IncomingHistory')

  if (ready) {
    let sortedHistory = props.history
    sortedHistory.sort((a, b) => ((new Date(b.updated_at)).getTime()) - ((new Date(a.updated_at)).getTime()))

    if (props.history.length > 0) {
      return (
        <>
          <p className='small-centered-paragraph'>
            <Trans count={props.history.length} i18nKey='IncomingHistory:main-title'>
              <strong>You have {{ count: props.history.length }} past booking.</strong>
            </Trans>
          </p>
          {sortedHistory.map(booking => {
            if (booking.status === 'declined') {
              return (
                <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='incoming-history' key={booking.id}>
                  <p className='small-centered-paragraph'>
                    <strong>{t('IncomingHistory:declined-request')}</strong>
                  </p>
                  <p className='small-centered-paragraph'>
                    <Trans count={booking.number_of_cats} i18nKey='IncomingHistory:declined-desc'>
                      You declined a booking request from <strong>{{ nickname: booking.user.nickname }}</strong> for their <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                    </Trans>
                  </p>
                  <Popup modal trigger={
                    <p className='fake-link-underlined'>
                      {t('IncomingHistory:view-message')}
                    </p>
                  }
                    position='top center'
                    closeOnDocumentClick={true}
                  >
                    <IncRequestDeclinedPopup
                      id={booking.id}
                      nickname={booking.user.nickname}
                      message={booking.host_message}
                      startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                      endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                    />
                  </Popup>
                </Container>
              )
            } else if (booking.status === 'canceled') {
              return (
                <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='incoming-history' key={booking.id}>
                  <p className='small-centered-paragraph'>
                    <strong>{t('IncomingHistory:canceled-request')}</strong>
                  </p>
                  <p className='small-centered-paragraph'>
                    <Trans count={booking.number_of_cats} i18nKey='IncomingHistory:canceled-desc'>
                      A booking request from <strong>{{ nickname: booking.user.nickname }}</strong> for their <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong> got canceled due to no answer from you within 3 days time.
                    </Trans>
                  </p>
                </Container>
              )
            } else {
              return (
                <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='incoming-history' key={booking.id}>
                  <p className='small-centered-paragraph'>
                    <Trans i18nKey='IncomingHistory:other-history'>
                      You hosted <strong>{{ nickname: booking.user.nickname }}'s</strong> cat(s) during the dates of <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                    </Trans>
                  </p>
                  <p className='fake-link-underlined'>
                    {t('IncomingHistory:view-review')}
                  </p>
                </Container>
              )
            }
          })}
        </>
      )
    } else {
      return (
        <>
          <p className='small-centered-paragraph'>
            <strong>{t('IncomingHistory:no-past-bookings')}</strong>
          </p>
        </>
      )
    }
  } else { return <Spinner /> }
}

export default IncomingHistory
