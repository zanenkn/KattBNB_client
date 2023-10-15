import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../../common/LanguageSwitcher';

import { Close } from '../../icons';
import { Divider } from '../../UI-Components';
import { MenuWrapper, InnerWrapper, SwitcherWrapper } from './styles';
import MainMenu from './mainMenu';
import UserMenu from './userMenu';

const Menu = ({ menuType, menuVisible, userLoggedIn, closeMenu }) => {
  const { ready } = useTranslation();
  const location = useLocation()

  if (!ready) return null;
  return (
    <MenuWrapper visible={menuVisible}>
      <button type='button' onClick={() => closeMenu()}>
        <Close fill='primary' height={5} />
      </button>
      <InnerWrapper>
        <InnerWrapper>
          {menuType === 'main' && <MainMenu closeMenu={() => closeMenu()} activePath={location.pathname} />}
          {menuType === 'user' && (
            <UserMenu closeMenu={() => closeMenu()} userLoggedIn={userLoggedIn} activePath={location.pathname} />
          )}
        </InnerWrapper>
        <SwitcherWrapper>
          <Divider thick />
          <div>
            <LanguageSwitcher />
          </div>
        </SwitcherWrapper>
      </InnerWrapper>
    </MenuWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    menuVisible: state.menu.visible,
    menuType: state.menu.type,
    userLoggedIn: state.reduxTokenAuth.currentUser.isSignedIn,
  };
};

const mapDispatchToProps = {
  closeMenu: () => ({
    type: 'CLOSE_MENU',
  }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
