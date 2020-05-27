import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, useTranslation } from 'react-i18next'
import OutRequestDeclinedPopup from './OutRequestDeclinedPopup'
import OutRequestCancelledPopup from './OutRequestCancelledPopup'
import Popup from 'reactjs-popup'

const OutgoingHistory = (props) => {

  const { t, ready } = useTranslation('OutgoingHistory')

  if (ready) {
    let sortedHistory = props.history
    sortedHistory.sort((a, b) => ((new Date(b.updated_at)).getTime()) - ((new Date(a.updated_at)).getTime()))

    if (props.history.length > 0) {
      return (
        <>
          <p className='small-centered-paragraph'>
            <Trans count={parseInt(props.history.length)} i18nKey='OutgoingHistory:main-header'>
              <strong>You have {{ count: props.history.length }} past booking.</strong>
            </Trans>
          </p>
          {sortedHistory.map(booking => {
            if (booking.status === 'declined') {
              return (
                <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='outgoing-history' key={booking.id}>
                  <p className='small-centered-paragraph'>
                    <strong>{t('OutgoingHistory:declined-req-header')}</strong>
                  </p>
                  <p className='small-centered-paragraph'>
                    <Trans count={parseInt(booking.number_of_cats)} i18nKey='OutgoingHistory:declined-req-desc'>
                      Your request to book a stay with <strong>{{ nickname: booking.host_nickname }}</strong> for your <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong> got declined.
                    </Trans>
                  </p>
                  <Popup modal trigger={
                    <p className='fake-link-underlined'>
                      {t('OutgoingHistory:view-message')}
                    </p>
                  }
                    position='top center'
                    closeOnDocumentClick={true}
                  >
                    <OutRequestDeclinedPopup
                      id={booking.id}
                      nickname={booking.host_nickname}
                      message={booking.host_message}
                      avatar={booking.host_avatar}
                      startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                      endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                    />
                  </Popup>
                </Container>
              )
            } else if (booking.status === 'canceled') {
              return (
                <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='outgoing-history' key={booking.id}>
                  <p className='small-centered-paragraph'>
                    <strong>{t('OutgoingHistory:canceled-req-header')}</strong>
                  </p>
                  <p className='small-centered-paragraph'>
                    <Trans count={parseInt(booking.number_of_cats)} i18nKey='OutgoingHistory:canceled-req-desc'>
                      Your request to book a stay with <strong>{{ nickname: booking.host_nickname }}</strong> for your <strong>{{ count: booking.number_of_cats }} cat</strong> during the dates of <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong> got canceled.
                    </Trans>
                  </p>
                  <Popup modal trigger={
                    <p className='fake-link-underlined'>
                      {t('OutgoingHistory:why')}
                    </p>
                  }
                    position='top center'
                    closeOnDocumentClick={true}
                  >
                    <OutRequestCancelledPopup
                      nickname={booking.host_nickname}
                      startDate={moment(booking.dates[0]).format('YYYY-MM-DD')}
                      endDate={moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD')}
                    />
                  </Popup>
                </Container>
              )
            } else {
              return (
                <Container style={{ 'backgroundColor': booking.review === null ? '#f3dde6' : '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={booking.id} data-cy='outgoing-history' key={booking.id}>
                  <p className='small-centered-paragraph'>
                    <Trans i18nKey='OutgoingHistory:req-desc'>
                      Your cat(s) stayed with <strong>{{ nickname: booking.host_nickname }}</strong> during the dates of <strong>{{ startDate: moment(booking.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(booking.dates[booking.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                    </Trans>
                  </p>
                  {booking.review === null ?
                    <p className='fake-link-underlined'>
                      {t('OutgoingHistory:write-review')}
                    </p>
                    :
                    <p className='fake-link-underlined'>
                      {t('OutgoingHistory:view-review')}
                    </p>}
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
            <strong>{t('OutgoingHistory:no-history')}</strong>
          </p>
        </>
      )
    }
  } else { return <Spinner /> }
}

export default OutgoingHistory
