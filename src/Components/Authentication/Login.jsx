import React, { useState } from 'react'
import { Header, Segment, Form, Message, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signInUser } from '../../reduxTokenAuthConfig'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const Login = (props) => {
  const { t, ready } = useTranslation('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorDisplay, setErrorDisplay] = useState(false)
  const [successDisplay, setSuccessDisplay] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const logInUser = () => {
    setLoading(true)
    const { history, signInUser } = props
    signInUser({ email, password })
      .then(() => {
        setSuccessDisplay(true)
        setErrorDisplay(false)
        if (history.length <= 2) {
          history.push('/')
        } else {
          history.go(-1)
        }
      }).catch(error => {
        setErrorDisplay(true)
        setErrors(error.response.data.errors[0])
        setLoading(false)
      })
  }

  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h1'>
          {t('Login:title')}
        </Header>
        <Segment className='whitebox'>
          <Form id='login-form'>
            <Form.Input
              required
              id='email'
              label={t('reusable:plch.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('reusable:plch.email')}
              onKeyPress={e => { e.key === 'Enter' && logInUser() }}
            />
            <Form.Input
              required
              id='password'
              type='password'
              label={t('reusable:plch.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('reusable:plch.password')}
              onKeyPress={e => { e.key === 'Enter' && logInUser() }}
            />
            {successDisplay === false &&
              <div style={{ 'textAlign': 'right' }}>
                <Header id='password-reset-link' as={Link} to='password-reset' className='fake-link-underlined' >
                  {t('Login:forgot-link')}
                </Header>
              </div>
            }
          </Form>
          {errorDisplay &&
            <Message negative style={{ 'textAlign': 'center' }} >
              {errors}
            </Message>
          }
          {successDisplay &&
            <Message success style={{ 'textAlign': 'center' }} >
              {t('Login:success-msg')}
            </Message>
          }
          <Button className='submit-button' id='log-in-button' loading={loading} onClick={() => logInUser()}>
            {t('Login:title')}
          </Button>
          {successDisplay === false &&
            <p style={{ 'textAlign': 'center', 'marginTop': '2rem' }}>
              {t('Login:no-acc')}
              <br></br>
              <Header as={Link} to='sign-up' className='fake-link'>
                {t('Login:signup-link')}
              </Header>
            </p>
          }
        </Segment>
      </div>
    )
  } else { return <Spinner /> }
}

export default connect(null, { signInUser })(Login)
