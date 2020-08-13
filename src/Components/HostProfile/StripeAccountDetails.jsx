import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'

const StripeAccountDetails = (props) => {

  const { t, ready } = useTranslation('')

  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      const lang = detectLanguage()
      const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${props.hostProfileId}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(path, { headers: headers })
        .then((response) => {
          console.log(response)
        })
        .catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 400) {
            setErrorDisplay(true)
            setErrors([error.response.data.error])
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

  return (
    'yay'
  )
}

export default StripeAccountDetails
