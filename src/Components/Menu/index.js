import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { MenuWrapper, MenuLink } from './styles';
import MainMenu from './mainMenu';
import UserMenu from './userMenu';

const Menu = ({ menuType, menuVisible, userLoggedIn, closeMenu }) => {
  const { ready } = useTranslation();

  if (!ready) return null;
  return (
    <MenuWrapper visible={menuVisible}>
      {menuType === 'main' && <MainMenu closeMenu={() => closeMenu()} />}
      {menuType === 'user' && <UserMenu closeMenu={() => closeMenu()} userLoggedIn={userLoggedIn} />}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Menu));
