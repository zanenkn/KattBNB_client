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
import { useTranslation, Trans } from 'react-i18next'

const UserPage = (props) => {
  const hostProfileElement = useRef()
  const { t, ready } = useTranslation('UserPage')
  const [form, setForm] = useState({
    editLocationForm: false,
    editPasswordForm: false,
    createHostProfileForm: false
  })
  const [hostProfile, setHostProfile] = useState([])
  const [description, setDescription] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [rate, setRate] = useState('')
  const [maxCats, setMaxCats] = useState('')
  const [supplement, setSupplement] = useState('')
  const [availability, setAvailability] = useState([])
  const [forbiddenDates, setForbiddenDates] = useState([])
  const [incomingBookings, setIncomingBookings] = useState([])
  const [outgoingBookings, setOutgoingBookings] = useState([])
  const [loading, setLoading] = useState(true)

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
          setDescription(resp.data.description)
          setFullAddress(resp.data.full_address)
          setRate(finalRate)
          setMaxCats(resp.data.max_cats_accepted)
          setSupplement(finalSupplement)
          setAvailability(resp.data.availability)
          setForbiddenDates(resp.data.forbidden_dates)
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
  }, [])

  const avatarFormHandler = () => {
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false, createHostProfileForm: false }))
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms()
    }
  }

  const formHandler = (e) => {
    let states = ['editLocationForm', 'editPasswordForm', 'createHostProfileForm']
    states.forEach(stt => {
      if (stt === e.target.id) {
        setForm(old => ({ ...old, [stt]: !form[stt] }))
      } else setForm(old => ({ ...old, [stt]: false }))
    })
    if (hostProfile.length === 1) {
      hostProfileElement.current.closeAllForms()
    }
  }

  const closeLocationAndPasswordForms = () => {
    setForm(old => ({ ...old, editLocationForm: false, editPasswordForm: false }))

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
            {form.editLocationForm &&
                <LocationUpdateForm
                location={props.location}
                fullAddress={fullAddress}
                closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
              />
            }
            <p>
              <svg fill='grey' height='1em' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path d='M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z' /></svg>
              &nbsp;******&ensp;
                <Header as='strong' id='editPasswordForm' onClick={e => formHandler(e)} className='fake-link-underlined'>
                {t('reusable:cta.change')}
              </Header>
            </p>
            {form.editPasswordForm &&
              <PasswordUpdateForm
              closeLocationAndPasswordForms={closeLocationAndPasswordForms.bind(this)}
            />
            }
          </div>
        </Segment>
        <Divider hidden />
        {hostProfile.length === 1 
          ?
          <HostProfile
            id={hostProfile[0].id}
            description={description}
            fullAddress={fullAddress}
            rate={rate}
            maxCats={maxCats}
            supplement={supplement}
            availability={availability}
            forbiddenDates={forbiddenDates}
            location={props.location}
            incomingBookings={incomingBookings}
            closeLocPasForms={closeLocationAndPasswordForms.bind(this)}
            ref={hostProfileElement}
          />
          :
          form.createHostProfileForm
            ?
            <HostProfileForm
              user_id={props.id}
              closeForm={formHandler.bind(this)}
              location={props.location} />
            :
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
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar
})

export default connect(mapStateToProps)(UserPage)
