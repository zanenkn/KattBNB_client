import React, { useEffect, useState } from 'react'
import { Message } from 'semantic-ui-react'
import { Trans, useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import axios from 'axios'

const AllReviews = (props) => {

  const { t, ready } = useTranslation('AllReviews')

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)

  useEffect(() => {
    setLoading(true)
    const lang = detectLanguage()
    if (window.navigator.onLine === false) {
      setLoading(false)
      setErrors(['reusable:errors:window-navigator'])
      setErrorDisplay(true)
    } else {
      axios.get(`/api/v1/reviews?host_profile_id=${props.id}&locale=${lang}`)
        .then(resp => {
          setReviews(resp.data)
          setLoading(false)
        })
        .catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            setLoading(false)
            setErrorDisplay(true)
            setErrors(['reusable:errors:500'])
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
  }, [props.id, t])

  if (ready && loading === false) {
    return (
      <>
        {
          errorDisplay &&
          <Message negative >
            <ul id='message-error-list'>
              {errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        }
        {
          reviews.length > 0 &&
          <>
            <p>
              {parseFloat(props.score).toFixed(1)}
            </p>
            <p>
              {reviews.length}
            </p>
          </>
        }
        {
          reviews.length === 0 ?
            t('AllReviews:no-reviews')
            :
            reviews.map((review) => {
              return (
                <p key={review.id} id={`review-${review.id}`}>
                  {review.score}
                  {review.body}
                  {review.user.nickname}
                  {review.user.profile_avatar}
                  {review.created_at}
                </p>
              )
            })
        }
      </>
    )
  } else {
    return (<Spinner />)
  }
}

export default AllReviews
