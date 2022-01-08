import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import axios from 'axios';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { MenuWrapper, MenuLink } from './styles'

const Menu = (props) => {

  const { t, ready } = useTranslation();

  const signOut = (e) => {
    e?.preventDefault();
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
    props.closeMenu();
  }

  if (ready) {
    let userLink;

    if (props.currentUserIn) {
      userLink = (
        <Link as={MenuLink} id='logout' onClick={() => signOut()}>
          {t('reusable:title.logout')}
        </Link>
      );
    } else {
      userLink = (
        <>
          <Link as={MenuLink} id='login' to='/login' onClick={() => props.closeMenu()}>
            {t('reusable:title.login-signup')}
          </Link>
        </>
      );
    }
    return (
      <MenuWrapper visible={props.menuVisible}>
        {props.menuType === 'main' ?
          <>
            {userLink}

            <Link as={MenuLink} id='about' to='/about-us' onClick={() => props.closeMenu()}>
              {t('reusable:title.about')}
            </Link>

            <Link as={MenuLink} id='faq' to='faq' onClick={() => props.closeMenu()}>
              {t('reusable:title.faq')}
            </Link>
            <Link as={MenuLink} id='contact' to='/contact-us' onClick={() => props.closeMenu()}>
              {t('reusable:title.contact')}
            </Link>
            <Link as={MenuLink} id='blog' to='/blog/all/1' onClick={() => props.closeMenu()}>
              {t('reusable:title.stories')}
            </Link>
            <Link as={MenuLink} id='legal' to='/legal' onClick={() => props.closeMenu()}>
              {t('reusable:title.legal')}
            </Link>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              {/* <Button id='se' className='lng-button' size='mini' onClick={() => changeLng('sv')}>
            Svenska
            </Button>
          <Button id='en' className='lng-button' size='mini' onClick={() => changeLng('en')}>
            English
            </Button> */}
            </div>
          </>
          :
          <p>user menu</p>

        }

      </MenuWrapper>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    menuVisible: state.menu.visible,
    menuType: state.menu.type,
    currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  };
};

const mapDispatchToProps = {
  closeMenu: () => ({
    type: 'CLOSE_MENU'
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu))
