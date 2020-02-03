import React from 'react'
import { Link } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const SignupSuccess = (props) => {
  const { t, ready } = useTranslation('SignupSuccess')

  if (props.currentUserIn) {
    window.localStorage.clear()
    setTimeout(function () { window.location.reload(true) }, 500)
  }

  if (ready) {
    return (
      <div className='content-wrapper'>
        <Header as='h1'>
          {t('SignupSuccess:title')}
        </Header>
        <Segment className='whitebox' textAlign='center'>
          <p>
            <Trans i18nKey='SignupSuccess:p'>
              Welcome, you have successfully signed up for KattBNB! You will need to confirm your email address in the next 24 hours in order to log in and start using our services. To continue, please follow the instructions we have sent to your email. If you didn't receive our message in your inbox, please refer to our <Header as={Link} to='faq' className='fake-link'>FAQ</Header> section.
            </Trans>
          </p>
        </Segment>
      </div>
    )
  } else { return <Spinner /> }
}

const mapStateToProps = state => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn })

export default connect(mapStateToProps)(SignupSuccess)
