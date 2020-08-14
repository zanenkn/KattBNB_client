import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Message } from 'semantic-ui-react'
import axios from 'axios'
import Spinner from '../ReusableComponents/Spinner'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'

const StripeAccountDetails = (props) => {

  const { t, ready } = useTranslation('')

  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)

  useEffect(() => {
    async function fetchStripeAccountDetails() {
      if (window.navigator.onLine === false) {
        setErrorDisplay(true)
        setErrors(['reusable:errors:window-navigator'])
      } else {
        try {
          const lang = detectLanguage()
          const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${props.hostProfileId}`
          const headers = {
            uid: window.localStorage.getItem('uid'),
            client: window.localStorage.getItem('client'),
            'access-token': window.localStorage.getItem('access-token')
          }
          const response = await axios.get(path, { headers: headers })
          console.log(response)
        } catch (error) {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'))
            wipeCredentials('/')
          } else {
            setErrorDisplay(true)
            setErrors([error.response.data.error])
          }
        }
      }
    } fetchStripeAccountDetails()
  }, [])

  if (ready) {
    return (
      <>
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
      'yay'
      </>
    )
  } else { return <Spinner /> }
}

export default StripeAccountDetails
