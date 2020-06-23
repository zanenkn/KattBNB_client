import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import Spinner from '../ReusableComponents/Spinner'
import { Form, Message, Button, Image } from 'semantic-ui-react'

const HostReplyReviewForm = (props) => {

  const { t, ready } = useTranslation('HostReplyReview')

  const [replyFormOpen, setReplyFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [reply, setReply] = useState('')

  useEffect(() => {
    if (window.location.hash !== '') {
      let id = window.location.hash.split('-')[1]
      if (parseInt(id) === props.reviewId) {
        setReplyFormOpen(true)
      }
    }
  }, [])

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
        setErrors(['HostReplyReview:update-error-1'])
        setErrorDisplay(true)
      } else if (reply.length > 1000) {
        setLoading(false)
        setErrors(['HostReplyReview:update-error-2'])
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
            window.alert(t('HostReplyReview:update-success'))
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
          <>
            <p>{props.hostReply}</p>
            <p>{props.hostNickname}</p>
            <p>{props.reviewUpdatedAt}</p>
            <Image src={props.hostAvatar} />
          </>
        )
      case replyFormOpen:
        return (
          <>
            <Form id='host-reply-form'>
              <Form.TextArea
                required
                id='host-reply'
                placeholder={t('HostReplyReview:plch')}
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
            </Form>
            <p style={{ 'textAlign': 'end', 'fontSize': 'smaller', 'fontStyle': 'italic' }}>
              {t('reusable:remaining-chars')} {1000 - reply.length}
            </p>
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
      default:
        return (
          <p onClick={() => setReplyFormOpen(true)} className='fake-link-underlined'>{t('reusable:cta:reply')}</p>
        )
    }
  } else {
    return <Spinner />
  }
}

export default HostReplyReviewForm
