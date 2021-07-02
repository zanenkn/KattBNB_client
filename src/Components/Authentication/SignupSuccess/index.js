import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../../ReusableComponents/Spinner';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import { Header, InlineLink, Whitebox, Text } from '../../../UI-Components';

const SignupSuccess = (props) => {
  const { t, ready } = useTranslation('SignupSuccess');

  if (props.currentUserIn) {
    wipeCredentials();
    setTimeout(function () {
      window.location.reload();
    }, 500);
  }

  if (!ready) {
    return <Spinner />;
  }
  return (
    <>
      <Header centered level={1}>{t('SignupSuccess:title')}</Header>
      <Whitebox>
        <Text centered>
          <Trans i18nKey='SignupSuccess:p'>
            You will need to confirm your email address in the next 24 hours in order to log in and start using our
            services. To continue, please follow the instructions we have sent to your email. If you didn't receive our
            message in your inbox make sure you check your spam folder, sometimes the confirmation email can end up
            there. More in our
            <InlineLink as={Link} to='faq' color='info'>
              FAQ
            </InlineLink>
            .
          </Trans>
        </Text>
      </Whitebox>
    </>
  );
};

const mapStateToProps = (state) => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn });

export default connect(mapStateToProps)(SignupSuccess);
