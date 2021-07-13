import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import Spinner from '../../ReusableComponents/Spinner';
import Success from '../../ReusableComponents/Success';
// MIGRATED

const PasswordResetSuccess = (props) => {
  const { ready } = useTranslation('PasswordResetSuccess');

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
    <Success
      translationName='PasswordResetSuccess'
      translationHeader='PasswordResetSuccess:title'
      translationKey='PasswordResetSuccess:p'
    />
  );
};

const mapStateToProps = (state) => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn });

export default connect(mapStateToProps)(PasswordResetSuccess);
