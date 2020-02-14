import React, { useState, useEffect, useRef } from 'react'
import HostProfileForm from '../HostProfile/HostProfileForm'
import HostProfile from '../HostProfile/HostProfile'
import Spinner from '../ReusableComponents/Spinner'
import { connect } from 'react-redux'
import { Header, Segment, Button, Divider } from 'semantic-ui-react'
import axios from 'axios'
import LocationUpdateForm from './LocationUpdateForm'
import PasswordUpdateForm from './PasswordUpdateForm'
import AvatarUpdateForm from './AvatarUpdateForm'
import NotificationsUpdateForm from './NotificationsUpdateForm'
import { useTranslation, Trans } from 'react-i18next'

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
    availability: []
  })

  const [forbiddenDates, setForbiddenDates] = useState([])
  const [incomingBookings, setIncomingBookings] = useState([])
  const [outgoingBookings, setOutgoingBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHostProfile, setLoadingHostProfile] = useState(true)

  useEffect(() => {
    if (hostProfile.length === 1) {
      const path = `/api/v1/host_profiles/${hostProfile[0].id}`
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
            availability: resp.data.availability
          })
          setForbiddenDates(resp.data.forbidden_dates)
          setLoadingHostProfile(false)
        })
    }
  }, [hostProfile])

  useEffect(() => {
    async function asyncDidMount() {
      const response = await axios.get(`/api/v1/host_profiles?user_id=${props.id}`)
      setHostProfile(response.data)
      setLoading(false)

      const pathIncoming = `/api/v1/bookings?host_nickname=${props.username}`
      const pathOutgoing = `/api/v1/bookings?user_id=${props.id}`
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token')
      }
      axios.get(pathIncoming, { headers: headers }).then(response => {
        setIncomingBookings(response.data)
      })
      axios.get(pathOutgoing, { headers: headers }).then(response => {
        setOutgoingBookings(response.data)
      })
    }
    asyncDidMount()
  }, [props.id, props.username])

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

  const destroyAccount = () => {
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, createHostProfileForm: false }))

    let noAccountDeleteIncoming = []
    let sendEmailToHostOutgoing = []
    let todaysDate = new Date()
    let utc = Date.UTC(todaysDate.getUTCFullYear(), todaysDate.getUTCMonth(), todaysDate.getUTCDate())
    let today = new Date(utc).getTime()

    if (incomingBookings.length > 0) {
      incomingBookings.map(booking => {
        if (booking.status === 'pending' || (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today)) {
          noAccountDeleteIncoming.push(booking)
        }
      })
    }
    if (outgoingBookings.length > 0) {
      outgoingBookings.map(booking => {
        if (booking.status === 'accepted' && booking.dates[booking.dates.length - 1] > today) {
          sendEmailToHostOutgoing.push(booking)
        }
      })
    }
    if (noAccountDeleteIncoming.length > 0) {
      window.alert(t('UserPage:delete-alert'))
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
          window.localStorage.clear()
          window.alert(t('UserPage:deletion-alert'))
          window.location.replace('/')
        })
        .catch(() => {
          window.alert(t('UserPage:deletion-error'))
          window.localStorage.clear()
          window.location.replace('/login')
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
          window.localStorage.clear()
          window.alert(t('UserPage:deletion-alert'))
          window.location.replace('/')
        })
        .catch(() => {
          window.alert(t('UserPage:deletion-error'))
          window.localStorage.clear()
          window.location.replace('/login')
        })
    }
  }

  if (ready === true && loading === false) {
    return (
      <div className='content-wrapper'>
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
              &nbsp;{props.location}&ensp;
                <Header as='strong' id='editLocationForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </p>
            <div style={{ 'max-height': form.editLocationForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 0.2s ease-in-out' }}>
              {form.editLocationForm &&
                <LocationUpdateForm
                location={props.location}
                fullAddress={element.fullAddress}
                closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
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
            <div style={{ 'max-height': form.editPasswordForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 0.2s ease-in-out' }}>
              {form.editPasswordForm &&
                <PasswordUpdateForm
                closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                />
              }
            </div>
            <p>
              <svg fill='grey' height='1em' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8a6 6 0 0 1 4.03-5.67 2 2 0 1 1 3.95 0A6 6 0 0 1 16 8v6l3 2v1H1v-1l3-2V8zm8 10a2 2 0 1 1-4 0h4z" /></svg>
              &nbsp;Notification settings&ensp;
                <Header as='strong' id='editNotificationsForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </p>
            <div style={{ 'max-height': form.editNotificationsForm ? '1000px' : '0px', 'height': 'auto', 'overflow': 'hidden', 'transition': 'max-height 0.2s ease-in-out' }}>
              {form.editNotificationsForm &&
                <NotificationsUpdateForm
                closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
                messageNotifications={props.messageNotifications}
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
          className='fake-link-underlined' style={{ 'color': 'silver', 'marginBottom': '1rem' }} >
          {t('UserPage:delete-cta')}
        </Header>
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
