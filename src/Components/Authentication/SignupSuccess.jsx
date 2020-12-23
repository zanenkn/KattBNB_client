import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import { wipeCredentials } from '../../Modules/wipeCredentials';

const SignupSuccess = (props) => {
  const { t, ready } = useTranslation('SignupSuccess');

  if (props.currentUserIn) {
    wipeCredentials();
    setTimeout(function () {
      window.location.reload(true);
    }, 500);
  }

  if (ready) {
    return (
      <div className='content-wrapper'>
        <Header as='h1'>{t('SignupSuccess:title')}</Header>
        <Segment className='whitebox' textAlign='center'>
          <p>
            <Trans i18nKey='SignupSuccess:p'>
              You will need to confirm your email address in the next 24 hours in order to log in and start using our
              services. To continue, please follow the instructions we have sent to your email. If you didn't receive
              our message in your inbox make sure you check your spam folder, sometimes the confirmation email can end
              up there. More in our
              <Header as={Link} to='faq' className='fake-link'>
                FAQ
              </Header>
              .
            </Trans>
          </p>
        </Segment>
      </div>
    );
  } else {
    return <Spinner />;
  }
};

const mapStateToProps = (state) => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn });

export default connect(mapStateToProps)(SignupSuccess);
