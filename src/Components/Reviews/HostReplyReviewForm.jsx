import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import { Form, Message, Button } from 'semantic-ui-react'

const HostReplyReviewForm = (props) => {

  const { t, ready } = useTranslation('HostReplyReviewForm')

  const [replyFormOpen, setReplyFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [reply, setReply] = useState('')

  const closeButton = () => {
    setReplyFormOpen(false)
    setReply('')
  }

  if (ready) {
    if (replyFormOpen) {
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
            <Button id='host-reply-submit-button' className='submit-button' disabled={loading} loading={loading}>{t('reusable:cta:save')}</Button>
          </div>
        </>
      )
    } else {
      return (<p onClick={() => setReplyFormOpen(true)} className='fake-link-underlined'>{t('HostReplyReviewForm:reply-cta')}</p>)
    }
  } else {
    return <Spinner />
  }
}

export default HostReplyReviewForm
