import React, { useState } from 'react'
import { Header, Segment, Form, Button, Dropdown, Message, Popup, Checkbox } from 'semantic-ui-react'
import { LOCATION_OPTIONS } from '../../Modules/locationData'
import { registerUser } from '../../reduxTokenAuthConfig'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import ClientCaptcha from 'react-client-captcha'
import PasswordStrengthBar from 'react-password-strength-bar'
import Spinner from '../ReusableComponents/Spinner'

const SignUp = (props) => {

  const { t, ready } = useTranslation('SignUp')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [nickname, setNickname] = useState('')
  const [location, setLocation] = useState('')
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const [userCaptcha, setUserCaptcha] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const createUser = () => {
    setLoading(true)
    if (window.navigator.onLine === false) {
      setErrors(['reusable:errors:window-navigator'])
      setErrorDisplay(true)
      setLoading(false)
    } else {
      if (termsAccepted === false) {
        setErrors(['SignUp:terms-error'])
        setErrorDisplay(true)
        setLoading(false)
      }
      else if (userCaptcha !== captcha) {
        setErrors(["SignUp:You didn't input the captcha phrase correctly, please try again!"])
        setErrorDisplay(true)
        setLoading(false)
      } else {
        const { history, registerUser } = props
        const langPref = detectLanguage()
        const lang = detectLanguage()
        const url = process.env.NODE_ENV === 'production' ? 'https://kattbnb.netlify.com/login' : 'http://localhost:3000/login'
        registerUser({ email, password, passwordConfirmation, location, nickname, url, lang, langPref })
          .then(() => {
            setErrorDisplay(false)
            history.push('/signup-success')
          }).catch(error => {
            if (error.response.status === 500) {
              setErrors(['reusable:errors:500'])
              setErrorDisplay(true)
              setLoading(false)
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm')
            } else {
              setErrors(error.response.data.errors.full_messages)
              setErrorDisplay(true)
              setLoading(false)
            }
          })
      }
    }
  }

  if (props.history.action === 'POP') {
    props.history.push({ pathname: '/' })
  }

  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('SignUp:title')}
        </Header>
        <Segment className='whitebox'>
          <p style={{ 'textAlign': 'center' }}>
            {t('SignUp:instructions')}
          </p>
          <Form id='signup-form'>
            <Form.Input
              required
              id='email'
              label={t('reusable:plch.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('reusable:plch.email')}
              onKeyPress={e => { e.key === 'Enter' && createUser() }}
            />
            <Popup
              trigger={
                <Form.Input
                  required
                  id='password'
                  type='password'
                  label={t('reusable:plch.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('reusable:plch.password')}
                  onKeyPress={e => { e.key === 'Enter' && createUser() }}
                />
              }
              header={t('reusable:plch.pass-strength-bar-popup-header')}
              content={
                <PasswordStrengthBar
                  style={{ 'marginBottom': '0.5rem' }}
                  password={password}
                  minLength={6}
                  scoreWords={[t('reusable:plch.weak'), t('reusable:plch.weak'), t('reusable:plch.okay'), t('reusable:plch.good'), t('reusable:plch.strong')]}
                  shortScoreWord={t('reusable:plch.pass-strength-bar')}
                />
              }
              on='focus'
            />
            <Form.Input
              required
              id='passwordConfirmation'
              type='password'
              label={t('reusable:plch.password-confirmation')}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder={t('reusable:plch.password-confirmation')}
              onKeyPress={e => { e.key === 'Enter' && createUser() }}
            />
            <Form.Input
              required
              id='nickname'
              label={t('SignUp:nickname-plch')}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t('SignUp:nickname-plch')}
              onKeyPress={e => { e.key === 'Enter' && createUser() }}
            />
            <div className='required field' style={{ 'marginBottom': '1.5em' }}>
              <label>
                {t('SignUp:location-plch')}
              </label>
              <Dropdown
                clearable
                search
                selection
                style={{ 'width': '100%' }}
                placeholder={t('SignUp:location-plch')}
                options={LOCATION_OPTIONS}
                id='location'
                onChange={(e, { value }) => setLocation(value)}
                onKeyPress={e => { e.key === 'Enter' && createUser() }}
              />
            </div>
            <div style={{ 'margin': '1em 0' }}>
              <ClientCaptcha
                captchaCode={code => setCaptcha(code)}
                fontFamily='bodoni'
                fontColor='#c90c61'
                charsCount={6}
                backgroundColor='#e8e8e8'
                width={130}
              />
            </div>
            <Form.Input
              label={t('SignUp:captcha-label')}
              required
              id='userCaptcha'
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder={t('SignUp:captcha-plch')}
              onKeyPress={e => { e.key === 'Enter' && createUser() }}
            />
          </Form>
          <div style={{ 'display': 'inline-flex', 'paddingTop': '1em' }}>
            <div className='toggle' onClick={() => setTermsAccepted(!termsAccepted)} >
              <Checkbox toggle checked={termsAccepted} />
            </div>
            <label style={{ 'paddingLeft': '1.3em', 'color': termsAccepted ? 'grey' : 'silver' }}>
              <Trans i18nKey='SignUp:terms-label'>
                I accept the <Header as={Link} to='/legal' target='_blank' className='fake-link-underlined'>Terms & Conditions</Header>
              </Trans>
            </label>
          </div>

          {errorDisplay &&
            <Message negative >
              <Message.Header style={{ 'textAlign': 'center' }}>{t('SignUp:error-header')}</Message.Header>
              <ul id='message-error-list'>
                {errors.map(error => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Message>
          }
          <Button id='sign-up-button' onClick={() => createUser()} loading={loading} disabled={loading}>
            {t('SignUp:title')}
          </Button>
        </Segment>
      </div>
    )
  } else { return <Spinner /> }
}

export default connect(null, { registerUser })(SignUp)
