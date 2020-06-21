import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import Spinner from '../ReusableComponents/Spinner'
import { Form, Message, Button } from 'semantic-ui-react'

const HostReplyReviewForm = (props) => {

  const { t, ready } = useTranslation('HostReplyReview')

  const [replyFormOpen, setReplyFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [reply, setReply] = useState('')

  const closeButton = () => {
    setReplyFormOpen(false)
    setReply('')
    setErrorDisplay(false)
    setErrors([])
  }

  const hostReplyReview = () => {
    const lang = detectLanguage()
    setLoading(true)
    if (window.navigator.onLine === false) {
      setLoading(false)
      setErrors(['reusable:errors:window-navigator'])
      setErrorDisplay(true)
    } else {
      if (reply === '') {
        setLoading(false)
        setErrors(['text cannot be empty'])
        setErrorDisplay(true)
      } else if (reply.length > 1000) {
        setLoading(false)
        setErrors(['no more than 1000 characters'])
        setErrorDisplay(true)
      } else {
        const path = `/api/v1/reviews/${props.reviewId}`
        const payload = {
          host_reply: reply,
          locale: lang
        }
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        axios.patch(path, payload, { headers: headers })
          .then(() => {
            window.alert('success!!!')
            props.reload(reply)
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              setLoading(false)
              setErrors(['reusable:errors:500'])
              setErrorDisplay(true)
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else {
              setLoading(false)
              setErrors([error.response.data.error])
              setErrorDisplay(true)
            }
          })
      }
    }
  }

  if (ready) {
    switch (true) {
      case props.hostReply !== null:
        return (
          <p>{props.hostReply}</p>
        )
        break
      case replyFormOpen:
        return (
          <>
            <Form id='host-reply-form'>
              <Form.TextArea
                required
                id='host-reply'
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
            </Form>
            {errorDisplay &&
              <Message negative >
                <Message.Header style={{ 'textAlign': 'center' }} >{t('reusable:errors:action-error-header')}</Message.Header>
                <ul id='message-error-list'>
                  {errors.map(error => (
                    <li key={error}>{t(error)}</li>
                  ))}
                </ul>
              </Message>
            }
            <div className='button-wrapper'>
              <Button onClick={() => closeButton()} secondary id='host-reply-close-button' className='cancel-button'>{t('reusable:cta:close')}</Button>
              <Button onClick={() => hostReplyReview()} id='host-reply-submit-button' className='submit-button' disabled={loading} loading={loading}>{t('reusable:cta:save')}</Button>
            </div>
          </>
        )
        break
      default:
        return (
          <p onClick={() => setReplyFormOpen(true)} className='fake-link-underlined'>{t('HostReplyReviewForm:reply-cta')}</p>
        )
    }
  } else {
    return <Spinner />
  }
}

export default HostReplyReviewForm
