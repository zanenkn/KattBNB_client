import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import Spinner from '../../ReusableComponents/Spinner';
import { Header, InlineLink, Whitebox, Text } from '../../../UI-Components';
// MIGRATED

const PasswordResetSuccess = (props) => {
  const { t, ready } = useTranslation('PasswordResetSuccess');

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
      <Header level={2} centered>
        {t('PasswordResetSuccess:title')}
      </Header>
      <Whitebox>
        <Text centered>
          <Trans i18nKey='PasswordResetSuccess:p'>
            You have successfully requested a password reset! To continue, please follow the instructions we have sent
            to your email. If you didn't receive our message in your inbox, please refer to our
            <InlineLink as={Link} to='faq' color='info'>
              FAQ
            </InlineLink>
            section.
          </Trans>
        </Text>
      </Whitebox>
    </>
  );
};

const mapStateToProps = (state) => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn });

export default connect(mapStateToProps)(PasswordResetSuccess);
