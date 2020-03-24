import React from 'react'
import moment from 'moment'
import { Container } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, useTranslation } from 'react-i18next'
import Popup from 'reactjs-popup'
import OutRequestUserMessagePopup from './OutRequestUserMessagePopup'

const OutgoingRequests = (props) => {

  const { t, ready } = useTranslation('OutgoingRequests')

  if (ready) {
    let sortedRequests = props.requests
    sortedRequests.sort((a, b) => ((new Date(b.created_at)).getTime()) - ((new Date(a.created_at)).getTime()))

    if (props.requests.length > 0) {
      return (
        <>
          <p className='small-centered-paragraph'>
            <Trans count={parseInt(props.requests.length)} i18nKey='OutgoingRequests:main-header'>
              <strong>You have made {{ count: props.requests.length }} booking request.</strong>
            </Trans>
          </p>
          <p style={{ 'textAlign': 'center' }}>
            {t('OutgoingRequests:desc')}
          </p>
          {sortedRequests.map(request => {
            return (
              <Container style={{ 'backgroundColor': '#e8e8e8', 'marginTop': '2rem', 'padding': '2rem' }} id={request.id} data-cy='outgoing-requests' key={request.id}>
                <p className='small-centered-paragraph'>
                  <Trans count={parseInt(request.number_of_cats)} i18nKey='OutgoingRequests:req-desc'>
                    You have requested to book a stay with <strong>{{ nickname: request.host_nickname }}</strong> for your <strong>{{ count: request.number_of_cats }} cat</strong> during the dates of <strong>{{ startDate: moment(request.dates[0]).format('YYYY-MM-DD') }}</strong> until <strong>{{ endDate: moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD') }}</strong>.
                  </Trans>
                </p>
                <p className='small-centered-paragraph'>
                  <Trans i18nKey='OutgoingRequests:reply-before'>
                    You will receive a reply before <strong>{{ date: moment(request.created_at).add(3, 'days').format('YYYY-MM-DD') }}</strong>.
                  </Trans>
                </p>
                <Popup modal trigger={
                  <p className='fake-link-underlined'>
                    {t('OutgoingRequests:view-message')}
                  </p>
                }
                  position='top center'
                  closeOnDocumentClick={true}
                >
                  <OutRequestUserMessagePopup
                    id={request.id}
                    nickname={request.user.nickname}
                    message={request.message}
                    avatar={request.user.avatar}
                    startDate={moment(request.dates[0]).format('YYYY-MM-DD')}
                    endDate={moment(request.dates[request.dates.length - 1]).format('YYYY-MM-DD')}
                  />
                </Popup>
              </Container>
            )
          })}
        </>
      )
    } else {
      return (
        <>
          <p className='small-centered-paragraph'>
            <strong>{t('OutgoingRequests:no-req')}</strong>
          </p>
        </>
      )
    }
  } else { return <Spinner /> }
}

export default OutgoingRequests
