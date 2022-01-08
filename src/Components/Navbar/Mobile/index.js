import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Close, Menu, UserRound, KattBNBMain } from '../../../icons';
import { Flexbox, Container } from '../../../UI-Components';
import { Nav, NavInnerWrap, MenuAvatar, Navlink, IconWrapper } from '../styles';

const MobileNav = ({ menuVisible, currentUserIn, username, avatar, dispatch }) => {
  let noAvatar = `https://ui-avatars.com/api/?name=${username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`;

  return (
    <Nav>
      <NavInnerWrap>
        <Container as={Link} to='/' space={0}>
          <KattBNBMain fill='white' height={5} />
        </Container>
        <Flexbox spaceItemsX={5}>
          <button>
            {currentUserIn ? (
              <MenuAvatar data-cy='user-avatar' size='sm' src={avatar || noAvatar} />
            ) : (
              <UserRound data-cy='visitor-avatar' fill='white' height={6} />
            )}
          </button>
          <button style={{ padding: '0' }} type='button' onClick={() => dispatch({ type: 'CHANGE_VISIBILITY' })}>
            {menuVisible ? <Close fill='white' height={5}/> : <Menu fill='white' height={5}/>}
          </button>
        </Flexbox>
      </NavInnerWrap>
    </Nav>
  );
};

const mapStateToProps = (state) => ({
  menuVisible: state.animation.menuVisible,
  currentUserIn: state.reduxTokenAuth.currentUser.isSignedIn,
  avatar: state.reduxTokenAuth.currentUser.attributes.avatar,
  username: state.reduxTokenAuth.currentUser.attributes.username,
});

export default connect(mapStateToProps)(MobileNav);
