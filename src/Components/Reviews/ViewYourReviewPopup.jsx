import React, { useState } from 'react'
import Spinner from '../ReusableComponents/Spinner'
import { Trans, useTranslation } from 'react-i18next'
import { Header } from 'semantic-ui-react'

const ViewYourReviewPopup = (props) => {
  const { t, ready } = useTranslation('ViewYourReviewPopup')
  const [nickname, setNickname] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [message, setMessage] = useState(null)


  if (ready) {
    return (
      <>
        <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
          <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
            {t('ViewYourReviewPopup:main-header')}
          </Header>
          <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
            <Trans i18nKey='ViewYourReviewPopup:desc'>
              You declined a booking request from <strong>{{ nickname: nickname }}</strong> for the dates of <strong>{{ startDate: startDate }}</strong> until <strong>{{ endDate: endDate }}</strong>.
            </Trans>
          </p>
        </div>
        <p style={{ 'fontSize': 'small', 'fontStyle': 'italic', 'margin': '1rem 0 0' }}>
          {message}
        </p>
      </>
    )
  } else { return <Spinner /> }



}

export default ViewYourReviewPopup