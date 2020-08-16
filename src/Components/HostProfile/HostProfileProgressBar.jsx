import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import StripeAccountDetails from './StripeAccountDetails'
import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'

const HostProfileProgressBar = (props) => {
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stripeAccountErrors, setStripeAccountErrors] = useState([])
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [activeStep, setActiveStep] = useState(1)


  const { t, ready } = useTranslation('')

  async function fetchStripeAccountDetails() {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
      setLoading(false)
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
        setPayoutSuccess(response.data.payouts_enabled)
        setStripeAccountErrors(response.data.requirements.errors)
        if (response.data.payouts_enabled) {
          setActiveStep(3)
        } else if (response.data.requirements.errors.length > 0) {
          setActiveStep(2)
        }
        setLoading(false)
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
          setLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    if (props.stripeAccountId) {
      fetchStripeAccountDetails()
    }
  }, [])


  if (!loading) {
    return (
      <>
        <div className='progress-bar-wrapper' style={{'marginBottom': '2rem'}}>
          
          <div className='progress-bar-steps'>
            <div className={`progress-bar-step ${activeStep >= 1 && 'step-done'}`}>
              1
            </div>
            <div className={`progress-bar-step ${activeStep >= 2 && 'step-done'}`}>
              2
            </div>
            <div className={`progress-bar-step ${activeStep >= 3 && 'step-done'}`}>
              3
            </div>
          </div>
          <div className='progress-bar-line'>
            <div className='inner-line' style={{'maxWidth': activeStep === 1 ? '25%' : activeStep === 2 ? '75%' : '100%'}}></div>
          </div>
        </div>
        {props.stripeAccountId === null ?
          <>
            <p>You have not provided payment information for your host profile.</p>
            <a href={`https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.REACT_APP_OFFICIAL === 'yes' ? process.env.REACT_APP_STRIPE_CLIENT_ID : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST}&response_type=code&state=${props.stripeState}&suggested_capabilities[]=transfers&stripe_user[email]=${props.email}&stripe_user[country]=SE`}>
              <Button>Do it now</Button>
            </a>
          </>
          : payoutSuccess ?
            <>
              <p>All good!</p>
              <Button>Go to payment dashboard</Button>
            </>

            : stripeAccountErrors &&
            <>
              <p>{stripeAccountErrors[0].reason}</p>
              <Button>Do it now</Button>
            </>
        }
      </>
    )
  } else {
    return ('loading')
  }
}

export default HostProfileProgressBar