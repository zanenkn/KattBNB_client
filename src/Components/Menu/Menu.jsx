import React, { Component } from 'react';
import { Sidebar, Segment, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import axios from 'axios';
import i18n from '../../i18n';
import { withTranslation } from 'react-i18next';

class Menu extends Component {
  handleMenuVisibilty = (e) => {
    this.props.menuVisbilityHandler();
  };

  signOut = (e) => {
    e.preventDefault();
    const { t } = this.props;
    if (window.navigator.onLine === false) {
      window.alert(t('reusable:errors:window-navigator'));
    } else {
      const path = '/api/v1/auth/sign_out';
      const headers = {
        uid: window.localStorage.getItem('uid'),
        client: window.localStorage.getItem('client'),
        'access-token': window.localStorage.getItem('access-token'),
      };
      axios
        .delete(path, { headers: headers })
        .then(() => {
          wipeCredentials('/');
        })
        .catch(() => {
          wipeCredentials('/login');
        });
    }
  };

  changeLng(lng) {
    i18n.changeLanguage(lng);
    window.localStorage.setItem('I18N_LANGUAGE', lng);
  }

  render() {
    const { t } = this.props;

    if (this.props.tReady) {
      let userLink;

      if (this.props.currentUserIn) {
        userLink = (
          <Header id='logout' className='menu-link' as={Link} onClick={this.signOut}>
            {t('reusable:title.logout')}
          </Header>
        );
      } else {
        userLink = (
          <>
            <Header id='login' className='menu-link' as={Link} to='/login'>
              {t('reusable:title.login-signup')}
            </Header>
          </>
        );
      }
      return (
        <Sidebar id='menu' as={Segment} animation='overlay' direction='left' visible={this.props.menuVisible}>
          {userLink}
          <Header id='about' className='menu-link' as={Link} to='/about-us'>
            {t('reusable:title.about')}
          </Header>
          <Header id='faq' className='menu-link' as={Link} to='faq'>
            {t('reusable:title.faq')}
          </Header>
          <Header id='contact' className='menu-link' as={Link} to='/contact-us'>
            {t('reusable:title.contact')}
          </Header>
          <Header id='partners' className='menu-link' as={Link} to='/partners'>
            {t('reusable:title.partners')}
          </Header>
          <Header id='legal' className='menu-link' as={Link} to='/legal'>
            {t('reusable:title.legal')}
          </Header>
          <div style={{ display: 'flex', alignSelf: 'center' }}>
            <Button id='se' className='lng-button' size='mini' onClick={() => this.changeLng('sv')}>
              Svenska
            </Button>
            <Button id='en' className='lng-button' size='mini' onClick={() => this.changeLng('en')}>
              English
            </Button>
          </div>
        </Sidebar>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    menuVisible: state.animation.menuVisible,
    currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  };
};

const mapDispatchToProps = {
  menuVisbilityHandler: (menuVisible) => ({
    type: 'CHANGE_VISIBILITY',
    menuVisbible: menuVisible,
  }),
};

export default withTranslation()(withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu)));
