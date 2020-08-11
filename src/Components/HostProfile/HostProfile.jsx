import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Divider, Header, Message, Segment, Button } from 'semantic-ui-react'
import MaxCatsUpdateForm from './MaxCatsUpdateForm'
import DescriptionUpdateForm from './DescriptionUpdateForm'
import RateUpdateForm from './RateUpdateForm'
import SupplementUpdateForm from './SupplementUpdateForm'
import AvailabilityUpdateForm from './AvailabilityUpdateForm'
import AvailabilityViewOnlyMode from './AvailabilityViewOnlyMode'
import AddressUpdateForm from './AddressUpdateForm'
import AllReviews from '../Reviews/AllReviews'
import Spinner from '../ReusableComponents/Spinner'
import queryString from 'query-string'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'

const HostProfile = forwardRef((props, ref) => {

  const { t, ready } = useTranslation('HostProfile')

  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [form, setForm] = useState({
    editDescriptionForm: false,
    editMaxCatsForm: false,
    editRateForm: false,
    editSupplementForm: false,
    editableCalendar: false,
    editAddress: false
  })

  useEffect(() => {
    if (queryString.parse(window.location.search).code && queryString.parse(window.location.search).state === props.stripeState) {
      if (window.navigator.onLine === false) {
        setErrorDisplay(true)
        setErrors(['reusable:errors:window-navigator'])
      } else {
        const lang = detectLanguage()
        const path = `/api/v1/host_profiles/${props.id}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const payload = {
          code: queryString.parse(window.location.search).code,
          locale: lang
        }
        axios.patch(path, payload, { headers: headers })
          .then((response) => {
            props.setElement('stripeAccountId', response.data.id)
            props.history.replace('/user-page')
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500 || error.response.status === 400) {
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
    }
  }, [])

  const closeAllForms = () => {
    setForm(old => ({
      ...old,
      editDescriptionForm: false,
      editMaxCatsForm: false,
      editRateForm: false,
      editSupplementForm: false,
      editableCalendar: false,
      editAddress: false
    }))
    setErrorDisplay(false)
    setErrors([])
  }

  useImperativeHandle(ref, () => ({
    closeAllForms() {
      closeAllForms()
    }
  }))

  const formHandler = e => {
    closeAllForms()
    let states = Object.keys(form)
    states.forEach(stt => {
      if (stt === e.target.id) {
        setForm(old => ({ ...old, [stt]: !form[stt] }))
      }
    })
    setErrorDisplay(false)
    setErrors([])
    props.closeLocPasForms()
  }

  if (ready) {
    return (
      <>
        <Segment className='whitebox'>
          <Header as='h1'>
            {t('HostProfile:main-header')}
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            <Trans i18nKey='HostProfile:main-title'>
              This is your <strong>host profile.</strong> Here you can update all your cat hosting information.
            </Trans>
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
          <Divider hidden />
          <p id='description'>
            <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
            &nbsp;{props.description}&ensp;
          <Header as='strong' id='editDescriptionForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div style={{ 'max-height': form.editDescriptionForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
            {form.editDescriptionForm &&
              <DescriptionUpdateForm
                description={props.description}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            }
          </div>
          <p id='address'>
            <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" /></svg>
            &nbsp;{props.fullAddress}&ensp;
          <Header as='strong' id='editAddress' onClick={e => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div style={{ 'max-height': form.editAddress ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
            {form.editAddress &&
              <AddressUpdateForm
                fullAddress={props.fullAddress}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                location={props.location}
                setElement={props.setElement}
              />
            }
          </div>
          <p id='maxCats'>
            <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236.62 236.62"><path d="M197.023,225.545c-1.145-9.533-11.68-10.614-17.805-9.958c-6.521-24.554,16.225-61.151,17.563-69.82c1.438-9.312-6.658-63.5-7.513-90.938C188.389,26.662,147.48-4.433,140.65,0.524c-6.768,7.484,9.748,17.585,1.054,26.245c-8.398,8.367-10.588,13.99-16.824,23.46c-15.976,24.255,27.318,24.558,27.318,24.558s-33.882,25.112-41.421,37.768c-6.943,11.656-9.854,24.696-18.232,35.688c-19.094,25.051-14.791,68.729-14.791,68.729s-36.17-11.839-16.264-53.133C76.643,132.406,84.107,86.02,50.016,97.95c-13.189,4.616,2.949,14.325,5.734,17.435c9.318,10.4,1.441,27.896-4.174,38.012c-15.037,27.091-20.496,55.475,11.154,72.978c14.063,7.776,33.055,9.7,52.17,9.982l48.64,0.14C179.564,237.294,197.689,234.298,197.023,225.545z" /></svg>
            &nbsp;{t('HostProfile:max-cats')} {props.maxCats}&ensp;
          <Header as='strong' id='editMaxCatsForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div style={{ 'max-height': form.editMaxCatsForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
            {form.editMaxCatsForm &&
              <MaxCatsUpdateForm
                maxCats={props.maxCats}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            }
          </div>
          <p id='rate'>
            <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm4 8h4v2H4v-2z" /></svg>
            &nbsp;{props.rate} {t('reusable:price:total-for-1')}&ensp;
          <Header as='strong' id='editRateForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div style={{ 'max-height': form.editRateForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
            {form.editRateForm &&
              <RateUpdateForm
                rate={props.rate}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            }
          </div>
          <p id='supplement'>
            <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" /></svg>
            &nbsp;{t('HostProfile:extra')} {props.supplement} {t('reusable:price:total-day')}&ensp;
            <Header as='strong' id='editSupplementForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
              {t('reusable:cta:change')}
            </Header>
          </p>
          <div style={{ 'max-height': form.editSupplementForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
            {form.editSupplementForm &&
              <SupplementUpdateForm
                supplement={props.supplement}
                id={props.id}
                closeAllForms={closeAllForms.bind(this)}
                setElement={props.setElement}
              />
            }
          </div>
          <p id='availability' style={{ 'marginBottom': '0' }}>
            <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" /></svg>
            &nbsp;{t('HostProfile:availability')}&ensp;
          <Header as='strong' id='editableCalendar' onClick={e => formHandler(e)} className='fake-link-underlined' >
              {t('reusable:cta:change')}
            </Header>
          </p>
          {form.editableCalendar ?
            <AvailabilityUpdateForm
              selectedDays={props.availability.map(function (date) {
                return new Date(date)
              })
              }
              availability={props.availability}
              forbiddenDates={props.forbiddenDates}
              id={props.id}
              incomingBookings={props.incomingBookings}
              closeAllForms={closeAllForms.bind(this)}
            />
            :
            <AvailabilityViewOnlyMode
              selectedDays={props.availability.map(function (date) {
                return new Date(date)
              })
              }
            />
          }
        </Segment>
        <Divider hidden />
        <Divider hidden />
        <Segment className='whitebox'>
          <Header as='h1'>
            {t('HostProfile:reviews-header')}
          </Header>
          <p style={{ 'textAlign': 'center', 'marginBottom': '2rem' }}>
            <Trans i18nKey='HostProfile:reviews-title'>
              Here you can see and reply to the <strong>reviews</strong> others have written about you.
            </Trans>
          </p>
          <div>
            <AllReviews
              hostProfileId={props.id}
              score={props.score}
            />
          </div>
        </Segment>
        {props.stripeAccountId === null ?
          <a href={`https://connect.stripe.com/express/oauth/authorize?client_id=${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_STRIPE_CLIENT_ID : process.env.REACT_APP_STRIPE_CLIENT_ID_TEST}&response_type=code&state=${props.stripeState}&suggested_capabilities[]=transfers&stripe_user[email]=${props.email}&stripe_user[country]=SE`}>
            <Button>Connect with Stripe</Button>
          </a>

          :
          <p>Go to your stripe dashboard</p>
        }
      </>
    )
  } else { return <Spinner /> }
})

export default withRouter(HostProfile)
