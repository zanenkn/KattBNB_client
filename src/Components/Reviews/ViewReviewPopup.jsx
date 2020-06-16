import React, { useState, useEffect } from 'react'
import Spinner from '../ReusableComponents/Spinner'
import ReviewScore from '../ReusableComponents/ReviewScore'
import { Trans, useTranslation } from 'react-i18next'
import { Header, Message, Image } from 'semantic-ui-react'
import axios from 'axios'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { detectLanguage } from '../../Modules/detectLanguage'
import moment from 'moment'

const ViewReviewPopup = (props) => {

  const { t, ready } = useTranslation('ViewReviewPopup')

  const [nickname, setNickname] = useState(null)
  const [message, setMessage] = useState(null)
  const [errors, setErrors] = useState(null)
  const [errorDisplay, setErrorDisplay] = useState(null)
  const [reviewDate, setReviewDate] = useState(null)
  const [score, setScore] = useState(null)
  const [avatar, setAvatar] = useState(null)

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
          if (resp.data.user === null) {
            setNickname('Deleted user')
            setAvatar('https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false')
          } else {
            setNickname(resp.data.user.nickname)
            setAvatar(resp.data.user.profile_avatar)
          }
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
            setErrors([error.response.data.error])
          }
        })
    }
  }, [])

  if (ready) {
    return (
      errorDisplay ?
        <Message negative style={{ 'textAlign': 'center' }} >
          {t(errors[0])}
        </Message>
        :
        <>
          <div style={{ 'margin': '-2rem -2rem 2rem', 'background': '#c90c61', 'padding': '2rem' }}>
            <Header as='h2' style={{ 'color': '#ffffff', 'textAlign': 'left' }}>
              {t('ViewReviewPopup:main-header')}
            </Header>
            <p style={{ 'color': '#ffffff', 'fontSize': 'small' }}>
              <Trans i18nKey='ViewReviewPopup:desc'>
                <strong>{{ nickname: nickname }}</strong> left you a review for a booking between the dates of <strong>{{ startDate: props.startDate }}</strong> and <strong>{{ endDate: props.endDate }}</strong>.
            </Trans>
            </p>
          </div>
          <div style={{ 'display': 'flex', 'alignItems': 'center' }}>
            <Image src={avatar === null ? `https://ui-avatars.com/api/?name=${nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : avatar} size='small' style={{ 'borderRadius': '50%', 'width': '3rem', 'height': '3rem' }}></Image>
            <Header style={{ 'margin': '0 1rem' }}>
              {nickname}
            </Header>
          </div>
          <div style={{ 'display': 'flex' }}>
            <ReviewScore score={score} displayNumerical={true} />
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

export default ViewReviewPopup
