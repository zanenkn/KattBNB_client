import React, { useState, useEffect, useRef } from 'react'
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
import { useTranslation, Trans } from 'react-i18next'
import { wipeCredentials } from '../../Modules/wipeCredentials'

const UserPage = (props) => {

  const hostProfileElement = useRef()
  const { t, ready } = useTranslation('UserPage')

  const [form, setForm] = useState({
    editLocationForm: false,
    editPasswordForm: false,
    createHostProfileForm: false,
    editNotificationsForm: false
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
    messageNotifications: props.messageNotifications
  })
  const [forbiddenDates, setForbiddenDates] = useState([])
  const [incomingBookings, setIncomingBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHostProfile, setLoadingHostProfile] = useState(true)
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [deleteDisplayNone, setDeleteDipslayNone] = useState(false)

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
              messageNotifications: props.messageNotifications
            })
            setForbiddenDates(resp.data.forbidden_dates)
            setLoadingHostProfile(false)
            setErrorDisplay(false)
            setErrors([])
          })
          .catch(error => {
            if (error.response.status === 500) {
              setErrorDisplay(true)
              setErrors(['reusable:errors:500'])
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
  }, [hostProfile, props.messageNotifications, props.location, t])

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
          if (error.response.status === 500) {
            setErrorDisplay(true)
            setErrors(['reusable:errors:500'])
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
        const pathIncoming = `/api/v1/bookings?host_nickname=${props.username}&locale=${lang}`
        const responseIncoming = await axios.get(pathIncoming, { headers: headers })
        setIncomingBookings(responseIncoming.data)
        setLoading(false)
        setErrorDisplay(false)
        setErrors([])
      } catch (error) {
        if (error.response.status === 500) {
          setErrorDisplay(true)
          setErrors(['reusable:errors:500'])
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
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, editNotificationsForm: false, createHostProfileForm: false }))
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms()
    }
  }

  const closeLocationAndPasswordForms = () => {
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, editNotificationsForm: false, createHostProfileForm: false }))
  }

  const formHandler = (e) => {
    let states = ['editLocationForm', 'editPasswordForm', 'createHostProfileForm', 'editNotificationsForm']
    states.forEach(stt => {
      if (stt === e.target.id) {
        setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, editNotificationsForm: false, createHostProfileForm: false, [stt]: !form[stt] }))
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
    setDeleteDipslayNone(true)
    if (window.navigator.onLine === false) {
      setDeleteDipslayNone(false)
      setErrorDisplay(true)
      setErrors(['reusable:errors:window-navigator'])
    } else {
      const lang = detectLanguage()
      const pathIncoming = `/api/v1/bookings?host_nickname=${props.username}&locale=${lang}`
      const pathOutgoing = `/api/v1/bookings?user_id=${props.id}&locale=${lang}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      try {
        const responseIncoming = await axios.get(pathIncoming, { headers: headers })
        const responseOutgoing = await axios.get(pathOutgoing, { headers: headers })
        let noAccountDeleteIncoming = []
        let sendEmailToHostOutgoing = []
        let todaysDate = new Date()
        let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
        let today = new Date(utc).getTime()

        if (responseIncoming.data.length > 0) {
          responseIncoming.data.map(booking => {
            if (booking.status === 'pending' || (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today)) {
              noAccountDeleteIncoming.push(booking)
            }
          })
        }
        if (responseOutgoing.data.length > 0) {
          responseOutgoing.data.map(booking => {
            if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
              sendEmailToHostOutgoing.push(booking)
            }
          })
        }
        if (noAccountDeleteIncoming.length > 0) {
          window.alert(t('UserPage:delete-alert'))
          setDeleteDipslayNone(false)
        }
        else if (sendEmailToHostOutgoing.length > 0 && window.confirm(t('UserPage:delete-consent'))) {
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
            .catch(() => {
              window.alert(t('UserPage:deletion-error'))
              wipeCredentials('/')
            })
        }
        else if (noAccountDeleteIncoming.length === 0 && sendEmailToHostOutgoing.length === 0 && window.confirm(t('UserPage:delete-confirm'))) {
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
            .catch(() => {
              window.alert(t('UserPage:deletion-error'))
              wipeCredentials('/')
            })
        } else {
          setDeleteDipslayNone(false)
        }
      } catch (error) {
        if (error.response.status === 500) {
          setDeleteDipslayNone(false)
          setErrorDisplay(true)
          setErrors(['reusable:errors:500'])
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'))
          wipeCredentials('/')
        } else {
          setDeleteDipslayNone(false)
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
        <Segment className='whitebox'>
          <Header as='h2'>
            <Trans i18nKey='UserPage:greeting' values={{ username: props.username }} />
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            <Trans i18nKey='UserPage:user-profile-p'>
              This is your <strong>user</strong> profile. Here you can update your avatar, location, and password.
            </Trans>
          </p>
          <AvatarUpdateForm
            avatar={props.avatar}
            username={props.username}
            closeAllForms={avatarFormHandler.bind(this)}
          />
          <div style={{ 'margin': 'auto', 'display': 'table' }}>
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M13.6 13.47A4.99 4.99 0 0 1 5 10a5 5 0 0 1 8-4V5h2v6.5a1.5 1.5 0 0 0 3 0V10a8 8 0 1 0-4.42 7.16l.9 1.79A10 10 0 1 1 20 10h-.18.17v1.5a3.5 3.5 0 0 1-6.4 1.97zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' /></svg>
              &nbsp;{props.email}
            </p>
            <p id='user-location'>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' /></svg>
              &nbsp;{element.location}&ensp;
                <Header as='strong' id='editLocationForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </p>
            <div style={{ 'max-height': form.editLocationForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editLocationForm &&
                <LocationUpdateForm
                  location={element.location}
                  fullAddress={element.fullAddress}
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                  setElement={elementUpdateHandler.bind(this)}
                />
              }
            </div>
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z' /></svg>
              &nbsp;******&ensp;
                <Header as='strong' id='editPasswordForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </p>
            <div style={{ 'max-height': form.editPasswordForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editPasswordForm &&
                <PasswordUpdateForm
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                />
              }
            </div>
            <p>
              <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8a6 6 0 0 1 4.03-5.67 2 2 0 1 1 3.95 0A6 6 0 0 1 16 8v6l3 2v1H1v-1l3-2V8zm8 10a2 2 0 1 1-4 0h4z" /></svg>
              &nbsp;{t('UserPage:notifications-header')}&ensp;
              <Header as='strong' id='editNotificationsForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </p>
            <div style={{ 'max-height': form.editNotificationsForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 1s ease-in-out' }}>
              {form.editNotificationsForm &&
                <NotificationsUpdateForm
                  closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                  messageNotifications={element.messageNotifications}
                  setElement={elementUpdateHandler.bind(this)}
                />
              }
            </div>
          </div>
        </Segment>
        <Divider hidden />
        {hostProfile.length === 1 && loadingHostProfile === false &&
          <HostProfile
            id={hostProfile[0].id}
            description={element.description}
            fullAddress={element.fullAddress}
            rate={element.rate}
            maxCats={element.maxCats}
            supplement={element.supplement}
            availability={element.availability}
            forbiddenDates={forbiddenDates}
            location={props.location}
            incomingBookings={incomingBookings}
            closeLocPasForms={closeLocationAndPasswordForms.bind(this)}
            ref={hostProfileElement}
            setElement={elementUpdateHandler.bind(this)}
          />}
        {hostProfile.length === 1 && loadingHostProfile === true &&
          <Spinner />
        }
        {form.createHostProfileForm && hostProfile.length === 0 &&
          <HostProfileForm
            user_id={props.id}
            closeForm={closeLocationAndPasswordForms.bind(this)}
            location={props.location} />
        }
        {form.createHostProfileForm === false && hostProfile.length === 0 &&
          <div style={{ 'maxWidth': '300px', 'margin': 'auto' }}>
            <p className='small-centered-paragraph'>{t('UserPage:no-host-profile')}</p>
            <Button id='createHostProfileForm' onClick={e => formHandler(e)}>
              {t('UserPage:host-profile-cta')}
            </Button>
          </div>
        }
        <Divider hidden />
        <Header id='delete-account-link' onClick={() => destroyAccount()}
          className='fake-link-underlined' style={{ 'color': 'silver', 'marginBottom': '1rem', 'display': deleteDisplayNone && 'none' }} >
          {t('UserPage:delete-cta')}
        </Header>
      </div>
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
  messageNotifications: state.reduxTokenAuth.currentUser.attributes.messageNotifications
})

export default connect(mapStateToProps)(UserPage)
