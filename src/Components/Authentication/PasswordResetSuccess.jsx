import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import Spinner from '../ReusableComponents/Spinner';

const PasswordResetSuccess = (props) => {
  const { t, ready } = useTranslation('PasswordResetSuccess');

  if (props.currentUserIn) {
    wipeCredentials();
    setTimeout(function () {
      window.location.reload();
    }, 500);
  }
  
  return <div>a</div>

  // if (ready) {
  //   return (
  //     <div className='content-wrapper'>
  //       <Header as='h1'>{t('PasswordResetSuccess:title')}</Header>
  //       <Segment className='whitebox' textAlign='center'>
  //         <p>
  //           <Trans i18nKey='PasswordResetSuccess:p'>
  //             You have successfully requested a password reset! To continue, please follow the instructions we have sent
  //             to your email. If you didn't receive our message in your inbox, please refer to our
  //             <Header as={Link} to='faq' className='fake-link'>
  //               FAQ
  //             </Header>
  //             section.
  //           </Trans>
  //         </p>
  //       </Segment>
  //     </div>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

const mapStateToProps = (state) => ({ currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn });

export default connect(mapStateToProps)(PasswordResetSuccess);
