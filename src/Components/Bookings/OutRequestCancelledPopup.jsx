import React from 'react'
import { Header } from 'semantic-ui-react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const OutRequestCancelledPopup = (props) => {

  const { t, ready } = useTranslation('OutRequestCancelledPopup')

  if (ready) {
    return (
      <>
        <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
          <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
            {t('OutRequestCancelledPopup:main-header')}
          </Header>
          <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
            <Trans i18nKey='OutRequestCancelledPopup:desc'>
              Your booking request for the dates of <strong>{{ startDate: props.startDate }}</strong> until <strong>{{ endDate: props.endDate }}</strong> got cancelled.
            </Trans>
          </p>
        </div>
        <p style={{ 'margin': '1rem 0 0' }}>
          <Trans i18nKey='OutRequestCancelledPopup:explanation'>
            Your booking got automatically cancelled due to <strong style={{ 'fontStyle': 'normal', 'color': '#c90c61' }}>{{ nickname: props.nickname }}</strong> not responding for 3 days.
          </Trans>
        </p>
        <p style={{ 'margin': '1rem 0 0' }}>
          <Trans i18nKey='OutRequestCancelledPopup:try-again'>
            Try to <Header as={Link} to='/search' className='fake-link-underlined-reg' style={{ 'fontStyle': 'normal' }}>search again</Header>, we hope you find a perfect host soon!
          </Trans>
        </p>
      </>
    )
  } else { return <Spinner /> }
}

export default OutRequestCancelledPopup
