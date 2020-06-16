import React, { useState, useEffect } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { Trans, useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import ReviewScore from '../ReusableComponents/ReviewScore'

const LeaveReview = (props) => {

  const { t, ready } = useTranslation('LeaveReview')

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewScore, setReviewScore] = useState(0)

  const onScoreClick = (e) => {
    setReviewScore(parseInt(e.currentTarget.id))
  }

  useEffect(() => {
    if (props.location.state === undefined || props.history.action === 'POP') {
      props.history.push('/all-bookings')
    }
  }, [])

  const createReview = () => {
    const lang = detectLanguage()
    setLoading(true)
    if (window.navigator.onLine === false) {
      setLoading(false)
      setErrors(['reusable:errors:window-navigator'])
      setErrorDisplay(true)
    } else {
      if (reviewScore < 1) {
        setLoading(false)
        setErrors(['LeaveReview:error-no-score'])
        setErrorDisplay(true)
      } else if (reviewBody === '') {
        setLoading(false)
        setErrors(['LeaveReview:error-empty'])
        setErrorDisplay(true)
      } else if (reviewBody.length > 1000) {
        setLoading(false)
        setErrors(['LeaveReview:error-length'])
        setErrorDisplay(true)
      } else {
        const path = '/api/v1/reviews'
        const payload = {
          score: reviewScore,
          body: reviewBody,
          host_nickname: props.location.state.hostNickname,
          user_id: props.location.state.userId,
          booking_id: props.location.state.bookingId,
          host_profile_id: props.location.state.hostProfileId,
          locale: lang
        }
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        axios.post(path, payload, { headers: headers })
          .then(() => {
            props.history.push('/successful-review')
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              setLoading(false)
              setErrorDisplay(true)
              setErrors(['reusable:errors:500'])
            } else if (error.response.status === 422) {
              window.alert(t('LeaveReview:error-no-host'))
              props.history.push('/all-bookings')
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'))
              wipeCredentials('/')
            } else {
              setLoading(false)
              setErrorDisplay(true)
              setErrors([error.response.data.error])
            }
          })
      }
    }
  }

  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('LeaveReview:title')}
        </Header>
        <Segment className='whitebox'>
          <p className='small-centered-paragraph' style={{ 'marginBottom': '2rem' }}>
            <Trans i18nKey='LeaveReview:desc'>
              Your cat(s) stayed with <strong style={{ 'color': '#c90c61' }}>{{ host: props.location.state.hostNickname }}</strong> during the dates of <strong style={{ 'color': '#c90c61' }}>{{ startDate: props.location.state.startDate }}</strong> until <strong style={{ 'color': '#c90c61' }}>{{ endDate: props.location.state.endDate }}</strong>. Help us to improve KattBNB community by reviewing your experience.
            </Trans>
          </p>
          <Form>
            <div className='required field' >
              <label>
                {t('LeaveReview:label')}
              </label>
              <ReviewScore setScore={(e) => onScoreClick(e)} score={reviewScore} clickable={true} displayNumerical={true} />
              <Form.TextArea
                placeholder={t('LeaveReview:placeholder')}
                required
                id='review-body'
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
              />
            </div>
          </Form>
          <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic' }}>
            {t('reusable:remaining-chars')} {1000 - reviewBody.length}
          </p>
          {errorDisplay &&
            <Message negative >
              <ul id='message-error-list'>
                {errors.map(error => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          }
          <Button onClick={() => createReview()} className='submit-button' loading={loading} disabled={loading}>{t('LeaveReview:cta')}</Button>
        </Segment>
      </div>
    )
  } else { return <Spinner /> }
}

export default LeaveReview
