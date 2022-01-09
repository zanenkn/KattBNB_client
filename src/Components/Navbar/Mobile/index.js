import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { getAvatar } from '../../../Modules/getAvatar';

import { Close, Menu, UserRound, KattBNBMain } from '../../../icons';
import { Flexbox, Container } from '../../../UI-Components';
import { Nav, NavInnerWrap, MenuAvatar } from '../styles';

const MobileNav = ({ menuVisible, currentUserIn, username, avatar, dispatch }) => {
  return (
    <>
      <Helmet
        bodyAttributes={{
          class: menuVisible ? 'overflow-hidden' : 'overflow-auto',
        }}
      />
      <Nav>
        <NavInnerWrap>
          <Container as={Link} to='/' space={0}>
            <KattBNBMain fill='white' height={5} />
          </Container>
          <Flexbox spaceItemsX={3}>
            <button onClick={() => dispatch({ type: 'OPEN_USER_MENU' })}>
              {currentUserIn ? (
                <MenuAvatar data-cy='user-avatar' size='sm' src={avatar ?? getAvatar(username)} />
              ) : (
                <UserRound data-cy='visitor-avatar' fill='white' height={6} />
              )}
            </button>
            {menuVisible ? (
              <button type='button' onClick={() => dispatch({ type: 'CLOSE_MENU' })}>
                <Close fill='white' height={5} />
              </button>
            ) : (
              <button type='button' onClick={() => dispatch({ type: 'OPEN_MAIN_MENU' })}>
                <Menu fill='white' height={5} />
              </button>
            )}
          </Flexbox>
        </NavInnerWrap>
      </Nav>
    </>
  );
};

const mapStateToProps = (state) => ({
  menuVisible: state.menu.visible,
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
  username: state.reduxTokenAuth.currentUser.attributes.username,
});

export default connect(mapStateToProps)(MobileNav);
