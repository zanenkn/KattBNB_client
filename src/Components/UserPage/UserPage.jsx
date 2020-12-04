/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import withAuth from '../../HOC/withAuth'
import HostProfileForm from '../HostProfile/HostProfileForm'
import HostProfile from '../HostProfile/HostProfile'
import Spinner from '../ReusableComponents/Spinner'
import { connect } from 'react-redux'
import { Header, Segment, Button, Divider, Message } from 'semantic-ui-react'
import axios from 'axios'
import Popup from 'reactjs-popup'
import { detectLanguage } from '../../Modules/detectLanguage'
import LocationUpdateForm from './LocationUpdateForm'
import PasswordUpdateForm from './PasswordUpdateForm'
import AvatarUpdateForm from './AvatarUpdateForm'
import NotificationsUpdateForm from './NotificationsUpdateForm'
import LangPrefUpdateForm from './LangPrefUpdateForm'
import { useTranslation } from 'react-i18next'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import Location from '../Icons/Location'
import HostProfileProgressBar from '../HostProfile/HostProfileProgressBar'
import AllReviews from '../Reviews/AllReviews'

const UserPage = (props) => {

  const hostProfileElement = useRef()
  const { t, ready } = useTranslation('UserPage')

  const [form, setForm] = useState({
    editLocationForm: false,
    editPasswordForm: false,
    createHostProfileForm: false,
    editNotificationsForm: false,
    editLangPrefForm: false
  })
  const [hostProfile, setHostProfile] = useState([])
  const [element, setElement] = useState({
    description: '',
    fullAddress: '',
    rate: '',
    maxCats: '',
    supplement: '',
    availability: [],
    location: props.location,
    messageNotifications: props.messageNotifications,
    langPref: props.langPref,
    stripeAccountId: null
  })
  const [forbiddenDates, setForbiddenDates] = useState([])
  const [hostProfileScore, setHostProfileScore] = useState(null)
  const [incomingBookings, setIncomingBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHostProfile, setLoadingHostProfile] = useState(true)
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [deleteDisplayNone, setDeleteDisplayNone] = useState(false)
  const [hostStripeState, setHostStripeState] = useState(null)

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      if (hostProfile.length === 1) {
        const lang = detectLanguage()
        const path = `/api/v1/host_profiles/${hostProfile[0].id}?locale=${lang}`
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        axios.get(path, { headers: headers })
          .then(resp => {
            let rateToNumber = parseFloat(resp.data.price_per_day_1_cat)
            let rateToString = rateToNumber.toFixed(2)
            let finalRate
            if (rateToString[rateToString.length - 1] === '0' && rateToString[rateToString.length - 2] === '0') {
              finalRate = parseFloat(rateToString)
            } else {
              finalRate = rateToString
            }
            let supplementToNumber = parseFloat(resp.data.supplement_price_per_cat_per_day)
            let supplementToString = supplementToNumber.toFixed(2)
            let finalSupplement
            if (supplementToString[supplementToString.length - 1] === '0' && supplementToString[supplementToString.length - 2] === '0') {
              finalSupplement = parseFloat(supplementToString)
            } else {
              finalSupplement = supplementToString
            }
            setElement({
              description: resp.data.description,
              fullAddress: resp.data.full_address,
              rate: finalRate,
              maxCats: resp.data.max_cats_accepted,
              supplement: finalSupplement,
              availability: resp.data.availability,
              location: props.location,
              messageNotifications: props.messageNotifications,
              langPref: props.langPref,
              stripeAccountId: resp.data.stripe_account_id
            })
            setHostStripeState(resp.data.stripe_state)
            setForbiddenDates(resp.data.forbidden_dates)
            setHostProfileScore(resp.data.score)
            setLoadingHostProfile(false)
            setErrorDisplay(false)
            setErrors([])
          })
          .catch(error => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 500) {
              setErrorDisplay(true)
              setErrors(['reusable:errors:500'])
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401'))
              wipeCredentials('/')
            } else {
              setErrorDisplay(true)
              setErrors(error.response.data.error)
            }
          })
      }
    }
  }, [hostProfile, props.messageNotifications, props.location, props.langPref, t])

  useEffect(() => {
    fetchIncomingBookings()
    async function asyncDidMount() {
      if (window.navigator.onLine === false) {
        setErrorDisplay(true)
        setErrors(['reusable:errors:window-navigator'])
      } else {
        try {
          const lang = detectLanguage()
          const response = await axios.get(`/api/v1/host_profiles?user_id=${props.id}&locale=${lang}`)
          setHostProfile(response.data)
          setLoading(false)
          setErrorDisplay(false)
          setErrors([])
        } catch (error) {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            setErrorDisplay(true)
            setErrors(['reusable:errors:500'])
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else {
            setErrorDisplay(true)
            setErrors(error.response.data.error)
          }
        }
      }
    } asyncDidMount()
  }, [])

  const fetchIncomingBookings = async () => {
    if (window.navigator.onLine === false) {
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      try {
        const lang = detectLanguage()
        const headers = {
          uid: window.localStorage.getItem('uid'),
          client: window.localStorage.getItem('client'),
          'access-token': window.localStorage.getItem('access-token')
        }
        const pathIncoming = `/api/v1/bookings?dates=only&stats=no&host_nickname=${props.username}&locale=${lang}`
        const responseIncoming = await axios.get(pathIncoming, { headers: headers })
        setIncomingBookings(responseIncoming.data)
        setErrorDisplay(false)
        setErrors([])
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 500) {
          setErrorDisplay(true)
          setErrors(['reusable:errors:500'])
        } else if (error.response.status === 503) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'))
          wipeCredentials('/')
        } else {
          setErrorDisplay(true)
          setErrors(error.response.data.error)
        }
      }
    }
  }

  const avatarFormHandler = () => {
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, editNotificationsForm: false, editLangPrefForm: false, createHostProfileForm: false }))
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms()
    }
  }

  const closeLocationAndPasswordForms = () => {
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, editNotificationsForm: false, editLangPrefForm: false, createHostProfileForm: false }))
  }

  const formHandler = (e) => {
    let states = ['editLocationForm', 'editPasswordForm', 'createHostProfileForm', 'editNotificationsForm', 'editLangPrefForm']
    states.forEach(stt => {
      if (stt === e.target.id) {
        setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, editNotificationsForm: false, editLangPrefForm: false, createHostProfileForm: false, [stt]: !form[stt] }))
      }
    })
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms()
    }
  }

  const elementUpdateHandler = (elementName, newState) => {
    let elements = Object.keys(element)
    elements.forEach(element => {
      if (element === elementName) {
        setElement(old => ({ ...old, [elementName]: newState }))
      }
    })
  }

  const destroyAccount = async () => {
    avatarFormHandler()
    setDeleteDisplayNone(true)
    if (window.navigator.onLine === false) {
      setDeleteDisplayNone(false)
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      const lang = detectLanguage()
      const bookings = `/api/v1/bookings?stats=yes&user_id=${props.id}&host_nickname=${props.username}&locale=${lang}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      try {
        const response = await axios.get(bookings, { headers: headers })
        let outgoingUpcoming = parseInt(response.data.stats.out_upcoming)
        let incomingRequests = parseInt(response.data.stats.in_requests)
        let incomingUpcoming = parseInt(response.data.stats.in_upcoming)

        if (incomingRequests !== 0 || incomingUpcoming !== 0) {
          window.alert(t('UserPage:delete-alert'))
          setDeleteDisplayNone(false)
        }
        else if (outgoingUpcoming !== 0 && window.confirm(t('UserPage:delete-consent'))) {
          const path = '/api/v1/auth'
          const headers = {
            uid: window.localStorage.getItem('uid'),
            client: window.localStorage.getItem('client'),
            'access-token': window.localStorage.getItem('access-token')
          }
          axios.delete(path, { headers: headers })
            .then(() => {
              window.alert(t('UserPage:deletion-alert'))
              wipeCredentials('/')
            })
            .catch(error => {
              if (error.response === undefined) {
                wipeCredentials('/is-not-available?atm')
              } else if (error.response.status === 503) {
                wipeCredentials('/is-not-available?atm')
              } else {
                window.alert(t('UserPage:deletion-error'))
                wipeCredentials('/')
              }
            })
        }
        else if (incomingRequests === 0 && incomingUpcoming === 0 && outgoingUpcoming === 0 && window.confirm(t('UserPage:delete-confirm'))) {
          const path = '/api/v1/auth'
          const headers = {
            uid: window.localStorage.getItem('uid'),
            client: window.localStorage.getItem('client'),
            'access-token': window.localStorage.getItem('access-token')
          }
          axios.delete(path, { headers: headers })
            .then(() => {
              window.alert(t('UserPage:deletion-alert'))
              wipeCredentials('/')
            })
            .catch(error => {
              if (error.response === undefined) {
                wipeCredentials('/is-not-available?atm')
              } else if (error.response.status === 503) {
                wipeCredentials('/is-not-available?atm')
              } else {
                window.alert(t('UserPage:deletion-error'))
                wipeCredentials('/')
              }
            })
        } else {
          setDeleteDisplayNone(false)
        }
      } catch (error) {
        if (error.response === undefined) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 500) {
          setDeleteDisplayNone(false)
          setErrorDisplay(true)
          setErrors(['reusable:errors:500'])
        } else if (error.response.status === 503) {
          wipeCredentials('/is-not-available?atm')
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'))
          wipeCredentials('/')
        } else {
          setDeleteDisplayNone(false)
          setErrorDisplay(true)
          setErrors(error.response.data.error)
        }
      }
    }
  }

  if (ready && loading === false) {
    return (
      <div className='content-wrapper'>
        <Popup
          modal
          open={errorDisplay}
          closeOnDocumentClick={true}
          onClose={() => { setErrorDisplay(false); setErrors([]) }}
          position='top center'
        >
          <div>
            <Message negative >
              <ul id='message-error-list'>
                {errors.map(error => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          </div>
        </Popup>

        <AvatarUpdateForm
          avatar={props.avatar}
          username={props.username}
          userId={props.id}
          closeAllForms={avatarFormHandler.bind(this)}
        />
        <Header id='nickname' as='h2' style={{ 'marginTop': '0.5rem', 'marginBottom': '0.5rem' }}>
          <svg fill='#c90c61' height='0.8em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" /></svg>
          &ensp;{props.username}
        </Header>
        <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center', 'marginBottom': '1rem', 'justifyContent': 'center' }}>
          <Location fill={'grey'} height={'1.2em'} />
          <p style={{ 'margin': '0 0 0 0.5rem' }}>{element.location}</p>
        </div>
        <Divider hidden />
        {
          hostProfile.length === 1 && loadingHostProfile === false &&
          <>
            <HostProfileProgressBar
              stripeAccountId={element.stripeAccountId}
              hostProfileId={hostProfile[0].id}
              stripeState={hostStripeState}
              email={props.email}
            />
            <HostProfile
              id={hostProfile[0].id}
              email={props.email}
              description={element.description}
              fullAddress={element.fullAddress}
              rate={element.rate}
              maxCats={element.maxCats}
              supplement={element.supplement}
              availability={element.availability}
              forbiddenDates={forbiddenDates}
              score={hostProfileScore}
              location={props.location}
              incomingBookings={incomingBookings}
              stripeState={hostStripeState}
              stripeAccountId={element.stripeAccountId}
              closeLocPasForms={closeLocationAndPasswordForms.bind(this)}
              ref={hostProfileElement}
              setElement={elementUpdateHandler.bind(this)}
            />
          </>
        }
        <Divider hidden />
        {
          hostProfile.length === 1 && loadingHostProfile === true &&
          <Spinner />
        }
        {
          form.createHostProfileForm && hostProfile.length === 0 &&
          <HostProfileForm
            user_id={props.id}
            closeForm={closeLocationAndPasswordForms.bind(this)}
            location={props.location} />
        }
        {
          form.createHostProfileForm === false && hostProfile.length === 0 &&
          <div style={{ 'maxWidth': '300px', 'margin': 'auto' }}>
            <p className='small-centered-paragraph'>{t('UserPage:no-host-profile')}</p>
            <Button id='createHostProfileForm' onClick={e => formHandler(e)}>
              {t('UserPage:host-profile-cta')}
            </Button>
            <Divider hidden />
            <Divider hidden />
          </div>
        }
        <Segment className='whitebox'>
          <Header as='h2'>
            {t('UserPage:settings-header')}
          </Header>
          <div style={{ 'width': 'max-content', 'margin': 'auto' }}>
            <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center', 'marginBottom': '1rem' }}>
              <div className='zondicon-wrapper'>
                <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' /></svg>
              </div>
              <p style={{ 'margin': '0px 0.3rem 0 0.5rem' }}>{props.email}</p>
            </div>
            <div id='user-location' style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center', 'marginBottom': '1rem' }}>
              <div className='zondicon-wrapper'>
                <svg fill='grey' height='1.2em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              </div>
              <p style={{ 'margin': '0px 0.3rem 0 0.5rem' }}>{element.location}</p>
              <Header style={{ 'margin': '0' }} as='strong' id='editLocationForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </div>
            <div style={{ 'maxHeight': form.editLocationForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editLocationForm &&
                <LocationUpdateForm
                  location={element.location}
                  fullAddress={element.fullAddress}
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                />
              }
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center', 'marginBottom': '1rem' }}>
              <div className='zondicon-wrapper'>
                <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z' /></svg>
              </div>
              <p style={{ 'margin': '0px 0.3rem 0 0.5rem' }}>******</p>
              <Header style={{ 'margin': '0' }} as='strong' id='editPasswordForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </div>
            <div style={{ 'maxHeight': form.editPasswordForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editPasswordForm &&
                <PasswordUpdateForm
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                />
              }
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center', 'marginBottom': '1rem' }}>
              <div className='zondicon-wrapper'>
                <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8a6 6 0 0 1 4.03-5.67 2 2 0 1 1 3.95 0A6 6 0 0 1 16 8v6l3 2v1H1v-1l3-2V8zm8 10a2 2 0 1 1-4 0h4z" /></svg>
              </div>
              <p style={{ 'margin': '0px 0.3rem 0 0.5rem' }}>{t('UserPage:notifications-header')}</p>
              <Header style={{ 'margin': '0' }} as='strong' id='editNotificationsForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </div>
            <div style={{ 'maxHeight': form.editNotificationsForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editNotificationsForm &&
                <NotificationsUpdateForm
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                  messageNotifications={element.messageNotifications}
                />
              }
            </div>
            <div style={{ 'display': 'flex', 'flexDirection': 'row', 'alignItems': 'center' }}>
              <div className='zondicon-wrapper'>
                <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm2-2.25a8 8 0 0 0 4-2.46V9a2 2 0 0 1-2-2V3.07a7.95 7.95 0 0 0-3-1V3a2 2 0 0 1-2 2v1a2 2 0 0 1-2 2v2h3a2 2 0 0 1 2 2v5.75zm-4 0V15a2 2 0 0 1-2-2v-1h-.5A1.5 1.5 0 0 1 4 10.5V8H2.25A8.01 8.01 0 0 0 8 17.75z" /></svg>
              </div>
              <p style={{ 'margin': '0px 0.3rem 0 0.5rem' }}>{t('UserPage:lang-pref-header')}</p>
              <Header style={{ 'margin': '0' }} as='strong' id='editLangPrefForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </div>
            <div style={{ 'maxHeight': form.editLangPrefForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editLangPrefForm &&
                <LangPrefUpdateForm
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                  langPref={element.langPref}
                />
              }
            </div>
          </div>
        </Segment>
        <Divider hidden />
        <Divider hidden />
        {hostProfile.length === 1 &&
          <Segment className='whitebox'>
            <Header as='h2'>
              {t('UserPage:reviews-header')}
            </Header>
            <div>
              <AllReviews
                hostProfileId={hostProfile[0].id}
                score={hostProfileScore}
              />
            </div>
          </Segment>
        }
        <Divider hidden />
        <Header id='delete-account-link' onClick={() => destroyAccount()}
          className='fake-link-underlined' style={{ 'color': 'silver', 'marginBottom': '1rem', 'display': deleteDisplayNone && 'none' }} >
          {t('UserPage:delete-cta')}
        </Header>
      </div >
    )
  } else if (ready && loading) {
    return (
      <div className='content-wrapper'>
        <Popup
          modal
          open={errorDisplay}
          closeOnDocumentClick={true}
          onClose={() => { setErrorDisplay(false); setErrors([]) }}
          position='top center'
        >
          <div>
            <Message negative >
              <ul id='message-error-list'>
                {errors.map(error => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          </div>
        </Popup>
      </div>
    )
  } else { return <Spinner /> }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username,
  location: state.reduxTokenAuth.currentUser.attributes.location,
  email: state.reduxTokenAuth.currentUser.attributes.uid,
  id: state.reduxTokenAuth.currentUser.attributes.id,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
  messageNotifications: state.reduxTokenAuth.currentUser.attributes.messageNotifications,
  langPref: state.reduxTokenAuth.currentUser.attributes.langPref
})

export default connect(mapStateToProps)(withAuth(UserPage))
