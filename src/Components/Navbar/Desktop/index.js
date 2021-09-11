import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { KattBNBMain } from '../../Icons';
import { Container, InlineLink, Text } from '../../../UI-Components';
import { Nav, NavInnerWrap } from '../styles';
import { MenuItem, Submenu, SubmenuItem, ItemWrapper } from './styles';

const DesktopNav = ({ avatar, username, currentUserIn }) => {
  let noAvatar = `https://ui-avatars.com/api/?name=${username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`;
  const [showSubmenus, setShowSubmenus] = useState(true);

  return (
    <Nav>
      <NavInnerWrap>
        <Container as={Link} to='/' space={0}>
          <KattBNBMain fill='white' height={6} />
        </Container>

        <ItemWrapper>
          <MenuItem>
            <InlineLink as={Link} to='/search'>
              Find a cat sitter
            </InlineLink>
          </MenuItem>

          <MenuItem showSubmenus={showSubmenus} onMouseOver={() => setShowSubmenus(true)}>
            <Text>About</Text>

            <Submenu>
              <SubmenuItem>
                <InlineLink as={Link} to='/about-us' onClick={() => setShowSubmenus(false)}>
                  About KattBNB
                </InlineLink>
              </SubmenuItem>
              <SubmenuItem>
                <InlineLink as={Link} to='/blog/all/1' onClick={() => setShowSubmenus(false)}>
                  Blog
                </InlineLink>
              </SubmenuItem>
              <SubmenuItem>
                <InlineLink as={Link} to='/contact-us' onClick={() => setShowSubmenus(false)}>
                  Contact us
                </InlineLink>
              </SubmenuItem>
            </Submenu>
          </MenuItem>
          <MenuItem showSubmenus={showSubmenus} onMouseOver={() => setShowSubmenus(true)}>
            {currentUserIn ? (
              <img
                src={avatar || noAvatar}
                style={{
                  height: '30px',
                  width: '30px',
                  padding: '1px',
                  border: 'white solid 2px',
                  borderRadius: '50%',
                }}
              ></img>
            ) : (
              <svg id='user-icon' className='nav-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                <path
                  fill='#FFFFFF'
                  d='M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Zm0,19a9,9,0,1,1,9-9A9,9,0,0,1,10,19Z'
                />
                <path fill='#FFFFFF' d='M10,11a3,3,0,0,0,3-3V6a3,3,0,0,0-3-3A3,3,0,0,0,7,6V8A3,3,0,0,0,10,11Z' />
                <path
                  fill='#FFFFFF'
                  d='M3.3,14.4a7.94,7.94,0,0,0,11.1,2.2,7.68,7.68,0,0,0,2.2-2.2A16.23,16.23,0,0,0,3.3,14.4Z'
                />
              </svg>
            )}
            <Submenu>
              {currentUserIn ? (
                <>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/user-page' onClick={() => setShowSubmenus(false)}>
                      User page
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/all-bookings' onClick={() => setShowSubmenus(false)}>
                      Bookings
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/messages' onClick={() => setShowSubmenus(false)}>
                      Messages
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/' onClick={() => setShowSubmenus(false)}>
                      Settings
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/faq' onClick={() => setShowSubmenus(false)}>
                      FAQ
                    </InlineLink>
                  </SubmenuItem>
                </>
              ) : (
                <>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/login' onClick={() => setShowSubmenus(false)}>
                      Log in
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/sign-up' onClick={() => setShowSubmenus(false)}>
                      Sign up
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/faq' onClick={() => setShowSubmenus(false)}>
                      FAQ
                    </InlineLink>
                  </SubmenuItem>
                </>
              )}
            </Submenu>
          </MenuItem>
        </ItemWrapper>
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

export default connect(mapStateToProps)(DesktopNav);
