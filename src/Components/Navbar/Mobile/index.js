import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAvatar } from '../../../Modules/getAvatar';

import { Close, Menu, UserRound, KattBNBMain } from '../../../icons';
import { Flexbox, Container } from '../../../UI-Components';
import { Nav, NavInnerWrap, MenuAvatar, Navlink, IconWrapper } from '../styles';

const MobileNav = ({ menuVisible, currentUserIn, username, avatar, dispatch }) => {
  return (
    <Nav>
      <NavInnerWrap>
        <Container as={Link} to='/' space={0}>
          <KattBNBMain fill='white' height={5} />
        </Container>
        <Flexbox spaceItemsX={5}>
          <button onClick={() => dispatch({ type: 'OPEN_USER_MENU' })}>
            {currentUserIn ? (
              <MenuAvatar data-cy='user-avatar' size='sm' src={avatar ?? getAvatar(username)} />
            ) : (
              <UserRound data-cy='visitor-avatar' fill='white' height={6} />
            )}
          </button>
          {menuVisible ? (
            <button style={{ padding: '0' }} type='button' onClick={() => dispatch({ type: 'CLOSE_MENU' })}>
              <Close fill='white' height={5} />
            </button>
          ) : (
            <button style={{ padding: '0' }} type='button' onClick={() => dispatch({ type: 'OPEN_MAIN_MENU' })}>
              <Menu fill='white' height={5} />
            </button>
          )}
        </Flexbox>
      </NavInnerWrap>
    </Nav>
  );
};

const mapStateToProps = (state) => ({
  menuVisible: state.menu.visible,
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
  username: state.reduxTokenAuth.currentUser.attributes.username,
});

export default connect(mapStateToProps)(MobileNav);
