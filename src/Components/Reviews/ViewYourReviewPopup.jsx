import React, { useState, useEffect } from 'react'
import Spinner from '../ReusableComponents/Spinner'
import ReviewScore from '../ReusableComponents/ReviewScore'
import { Trans, useTranslation } from 'react-i18next'
import { Header, Message } from 'semantic-ui-react'
import axios from 'axios'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { detectLanguage } from '../../Modules/detectLanguage'
import moment from 'moment'

const ViewYourReviewPopup = (props) => {
  const { t, ready } = useTranslation('ViewYourReviewPopup')
  const [nickname, setNickname] = useState(null)
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState(null)
  const [errorDisplay, setErrorDisplay] = useState(null)
  const [reviewDate, setReviewDate] = useState(null)
  const [score, setScore] = useState(null)

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true)
      setErrors('reusable:errors:window-navigator')
    } else {

      const lang = detectLanguage()
      const path = `/api/v1/reviews/${props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const payload = { locale: lang }
      axios.get(path, payload, { headers: headers })
        .then(resp => {
          setNickname(resp.data.host_nickname)
          setMessage(resp.data.body)
          setReviewDate(resp.data.created_at)
          setScore(resp.data.score)
        })
        .catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            setErrorDisplay(true)
            setErrors('reusable:errors:500')
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'))
            wipeCredentials('/')
          } else {
            setErrorDisplay(true)
            setErrors(error.response.data.error)
          }
        })
    }
  }, [])



  if (ready) {
    return (
      errorDisplay ?
        <Message negative style={{ 'textAlign': 'center' }} >
          {t(errors)}
        </Message>
        :
        <>
          <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
            <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
              {t('ViewYourReviewPopup:main-header')}
            </Header>
            <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
              <Trans i18nKey='ViewYourReviewPopup:desc'>
                You declined a booking request from <strong>{{ nickname: nickname }}</strong> for the dates of <strong>{{ startDate: props.startDate }}</strong> until <strong>{{ endDate: props.endDate }}</strong>.
            </Trans>
            </p>
          </div>
          <div style={{ 'display': 'flex' }}>
            <ReviewScore score={score} clickable={false} />
          </div>
          <div style={{ 'maxHeight': '200px', 'overflow': 'auto', 'fontSize': 'small', 'fontStyle': 'italic' }}>
            <p>
              {message}
            </p>
            <p>{moment(reviewDate).format('YYYY-MM-DD')}</p>

          </div>

        </>
    )
  } else { return <Spinner /> }
}

export default ViewYourReviewPopup