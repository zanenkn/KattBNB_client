import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import LanguageSwitcher from '../../common/LanguageSwitcher';

import { MenuWrapper, InnerWrapper, SwitcherWrapper } from './styles';
import MainMenu from './mainMenu';
import UserMenu from './userMenu';
import { Divider } from '../../UI-Components';

const Menu = ({ menuType, menuVisible, userLoggedIn, closeMenu }) => {
  const { ready } = useTranslation();

  if (!ready) return null;
  return (
    <MenuWrapper visible={menuVisible}>
      <InnerWrapper>
        {menuType === 'main' && <MainMenu closeMenu={() => closeMenu()} />}
        {menuType === 'user' && <UserMenu closeMenu={() => closeMenu()} userLoggedIn={userLoggedIn} />}
      </InnerWrapper>
      <SwitcherWrapper>
       
        <Divider thick />
      
        <div>
          <LanguageSwitcher />
        </div>
      </SwitcherWrapper>
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
