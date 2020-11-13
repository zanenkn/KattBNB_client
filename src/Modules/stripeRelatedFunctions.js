import axios from 'axios'
import { detectLanguage } from '../Modules/detectLanguage'
import { wipeCredentials } from '../Modules/wipeCredentials'


export const fetchStripeAccountDetails = async ({
  setErrorDisplay, 
  setErrors, 
  setLoading, 
  setPayoutSuccess,
  setStripeAccountErrors,
  setStripePendingVerification,
  setActiveStep
}) => {
  if (window.navigator.onLine === false) {
    setErrorDisplay(true)
    setErrors(['reusable:errors:window-navigator'])
    setLoading(false)
  } else {
    try {
      const lang = detectLanguage()
      const path = `/api/v1/stripe?locale=${lang}&host_profile_id=${props.hostProfileId}&occasion=retrieve`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      const response = await axios.get(path, { headers: headers })
      if (!response.data.message) {
        setPayoutSuccess(response.data.payouts_enabled)
        setStripeAccountErrors(response.data.requirements.errors)
        setStripePendingVerification(response.data.requirements.pending_verification.length > 0 ? true : false)
        if (response.data.payouts_enabled) {
          setActiveStep(3)
        } else if (response.data.requirements.errors.length > 0 || response.data.requirements.pending_verification.length > 0) {
          setActiveStep(2)
        }
      }
      setLoading(false)
    } catch (error) {
      if (error.response === undefined) {
        wipeCredentials('/is-not-available?atm')
      } else if (error.response.status === 555) {
        setErrorDisplay(true)
        setErrors([error.response.data.error])
        setLoading(false)
      } else if (error.response.status === 503) {
        wipeCredentials('/is-not-available?atm')
      } else if (error.response.status === 401) {
        window.alert(t('reusable:errors:401'))
        wipeCredentials('/')
      } else {
        setErrorDisplay(true)
        setErrors([error.response.data.error])
        setLoading(false)
      }
    }
  }
}
