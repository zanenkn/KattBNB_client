import React from 'react';
import { Sidebar, Segment, Header, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import axios from 'axios';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

const Menu = (props) => {
  const { t, ready } = useTranslation();

  const signOut = () => {
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

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
    window.localStorage.setItem('I18N_LANGUAGE', lng);
  };

  if (ready) {
    return (
      <Sidebar id='menu' as={Segment} animation='overlay' direction='left' visible={props.menuVisible}>
        <Button id='paws-cta' as={Link} to='/paws-of-peace'>{t('reusable:title.paws')} 🇺🇦</Button>
        {props.currentUserIn ? (
          <Header id='logout' className='menu-link' as={Link} onClick={signOut}>
            {t('reusable:title.logout')}
          </Header>
        ) : (
          <Header id='login' className='menu-link' as={Link} to='/login'>
            {t('reusable:title.login-signup')}
          </Header>
        )}
        <Header id='about' className='menu-link' as={Link} to='/about-us'>
          {t('reusable:title.about')}
        </Header>
        <Header id='faq' className='menu-link' as={Link} to='faq'>
          {t('reusable:title.faq')}
        </Header>
        <Header id='contact' className='menu-link' as={Link} to='/contact-us'>
          {t('reusable:title.contact')}
        </Header>
        <Header id='blog' className='menu-link' as={Link} to='/blog'>
          {t('reusable:title.stories')}
        </Header>
        <Header id='legal' className='menu-link' as={Link} to='/legal'>
          {t('reusable:title.legal')}
        </Header>
        <div style={{ display: 'flex', alignSelf: 'center' }}>
          <Button id='se' className='lng-button' size='mini' onClick={() => changeLng('sv')}>
            Svenska
          </Button>
          <Button id='en' className='lng-button' size='mini' onClick={() => changeLng('en')}>
            English
          </Button>
        </div>
      </Sidebar>
    );
  } else {
    return null;
  }
};

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu));
