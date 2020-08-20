/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import Spinner from '../ReusableComponents/Spinner'
import HostProfile from '../Icons/HostProfile'
import CreditCard from '../Icons/CreditCard'
import Verified from '../Icons/Verified'

const HostProfileProgressBar = (props) => {

  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stripeAccountErrors, setStripeAccountErrors] = useState([])
  const [payoutSuccess, setPayoutSuccess] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  const { t, ready } = useTranslation('HostProfileProgressBar')

  const fetchStripeAccountDetails = async () => {
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
        if (!response.data.message) {
          setPayoutSuccess(response.data.payouts_enabled)
          setStripeAccountErrors(response.data.requirements.errors)
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
    fetchStripeAccountDetails()
  }, [])


  if (!loading && ready) {
    return (
      <div style={{ 'margin': '0 auto 5rem', 'maxWidth': '560px' }}>
        <div style={{ 'background': '#f5f5f5', 'padding': '1rem', 'width': 'max-content', 'margin': 'auto' }}>
          <div style={{ 'maxWidth': '300px', 'margin': 'auto' }}>
            <div className='explained' style={{ 'marginBottom': '1rem' }}>
              <HostProfile height={'2rem'} fill={'#e0e0e0'} class={`step-explanation ${activeStep >= 1 && 'step-done-fill'}`} />
              <CreditCard height={'2rem'} fill={'#e0e0e0'} class={`step-explanation ${activeStep >= 2 && 'step-done-fill'}`} />
              <Verified height={'2rem'} fill={'#e0e0e0'} class={`step-explanation ${activeStep >= 3 && 'step-done-fill'}`} />
            </div>
            <div className='progress-bar-wrapper'>
              <div className='progress-bar-steps'>
                <div className={`progress-bar-step ${activeStep >= 1 && 'step-done-color'}`}>
                  1
                </div>
                <div className={`progress-bar-step ${activeStep >= 2 && 'step-done-color'}`}>
                  2
                </div>
                <div className={`progress-bar-step ${activeStep >= 3 && 'step-done-color'}`}>
                  3
                </div>
              </div>
              <div className='progress-bar-line'>
                <div className='inner-line' style={{ 'maxWidth': activeStep === 1 ? '25%' : activeStep === 2 ? '75%' : '100%' }}></div>
              </div>
            </div>
            <div className='explained' style={{ 'marginTop': '1rem' }}>
              <div className='step-explanation'>
                <p>{t('HostProfileProgressBar:step-1')}</p>
              </div>
              <div className='step-explanation'>
                <p>{t('HostProfileProgressBar:step-2')}</p>
              </div>
              <div className='step-explanation'>
                <p>{t('HostProfileProgressBar:step-3')}</p>
              </div>
            </div>
          </div>
        </div>
        {props.stripeAccountId === null ?
          <>
            <p style={{ 'textAlign': 'center', 'marginTop': '2rem', 'fontSize': 'unset' }}>
              <Trans i18nKey={'HostProfileProgressBar:step-1-text'}>
                You made a host profile but have not provided us with your payment information. Without that we can not pay you for your gigs! <span className='fake-link-underlined'>Read more on how we handle payments and your information</span>
              </Trans>
            </p>
            <a href={`https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.REACT_APP_OFFICIAL === 'yes' ? process.env.REACT_APP_STRIPE_CLIENT_ID : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST}&response_type=code&state=${props.stripeState}&suggested_capabilities[]=transfers&stripe_user[email]=${props.email}&stripe_user[country]=SE`}>
              <Button>{t('HostProfileProgressBar:stripe-onboarding-cta')}</Button>
            </a>
          </>
          : payoutSuccess ?
            <>
              <Button>{t('HostProfileProgressBar:stripe-dashboard-cta')}</Button>
            </>
            : stripeAccountErrors &&
            <>
              <p style={{ 'textAlign': 'center', 'marginTop': '2rem', 'fontSize': 'unset' }}>
                <Trans i18nKey={'HostProfileProgressBar:step-2-text'}>
                  You have entered your payment information but are not yet verified with our payment solution provider (Stripe). <span className='fake-link-underlined'>Why is that?</span>
                </Trans>
              </p>
              {/* <p>{stripeAccountErrors[0].reason}</p> */}
              <Button>{t('HostProfileProgressBar:stripe-dashboard-cta')}</Button>
            </>
        }
      </div>
    )
  } else { return <Spinner /> }
}

export default HostProfileProgressBar
