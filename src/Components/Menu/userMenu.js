import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { wipeCredentials } from '../../Modules/wipeCredentials';

import { Header } from '../../UI-Components';
import { MenuLink } from './styles';

const UserMenu = ({ userLoggedIn, closeMenu, activePath }) => {
  const { t } = useTranslation();

  const signOut = () => {
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
  };

  if (userLoggedIn) {
    return (
      <>
        <Header level={3} color={activePath === '/user-page' ? 'primary' : 'neutral'}>
          <Link as={MenuLink} id='profile' to='/user-page' onClick={() => closeMenu()}>
            {t('reusable:navigation.user-page')}
          </Link>
        </Header>
        <Header level={3} color={activePath === '/messenger' ? 'primary' : 'neutral'}>
          <Link as={MenuLink} id='messenger' to='/messenger' onClick={() => closeMenu()}>
            {t('reusable:navigation.messages')}
          </Link>
        </Header>
        <Header level={3} space={10} color={activePath === '/all-bookings' ? 'primary' : 'neutral'}>
          <Link as={MenuLink} id='bookings' to='/all-bookings' onClick={() => closeMenu()}>
            {t('reusable:navigation.bookings')}
          </Link>
        </Header>
        <Header level={3}>
          <Link as={MenuLink} id='logout' onClick={() => signOut()}>
            {t('reusable:title.logout')}
          </Link>
        </Header>
      </>
    );
  } else {
    return (
      <>
        <Header level={3} color={activePath === '/login' ? 'primary' : 'neutral'}>
          <Link as={MenuLink} id='login' to='/login' onClick={() => closeMenu()}>
            {t('reusable:navigation.login')}
          </Link>
        </Header>
        <Header level={3} color={activePath === '/sign-up' ? 'primary' : 'neutral'}>
          <Link as={MenuLink} id='signup' to='/sign-up' onClick={() => closeMenu()}>
            {t('reusable:navigation.signup')}
          </Link>
        </Header>
      </>
    );
  }
};

export default UserMenu;
