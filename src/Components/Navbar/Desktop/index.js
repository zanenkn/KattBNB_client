import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { wipeCredentials } from '../../../Modules/wipeCredentials';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { KattBNBMain, UserRound } from '../../Icons';
import { Container, InlineLink, Text } from '../../../UI-Components';
import { Nav, NavInnerWrap, MenuDivider } from '../styles';
import { MenuItem, Submenu, SubmenuItem, ItemWrapper, MenuAvatar } from './styles';
import LanguageSwitcher from '../../ReusableComponents/LanguageSwitcher';

const DesktopNav = ({ avatar, username, currentUserIn }) => {
  const noAvatar = `https://ui-avatars.com/api/?name=${username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`;
  const [showSubmenus, setShowSubmenus] = useState(true);
  const { t } = useTranslation();

  const signOut = () => {
    if (window.navigator.onLine === false) {
      window.alert(t('reusable:errors:window-navigator'));
    }
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

  return (
    <Nav>
      <NavInnerWrap>
        <Container as={Link} to='/' space={0}>
          <KattBNBMain fill='white' height={6} />
        </Container>

        <ItemWrapper>
          <MenuItem>
            <InlineLink as={Link} to='/search'>
              {t('reusable:navigation.search')}
            </InlineLink>
          </MenuItem>

          <MenuItem showSubmenus={showSubmenus} onMouseOver={() => setShowSubmenus(true)}>
            <Text>{t('reusable:navigation.about')}</Text>

            <Submenu>
              <SubmenuItem>
                <InlineLink as={Link} to='/about-us' onClick={() => setShowSubmenus(false)}>
                  {t('reusable:navigation.about-kattbnb')}
                </InlineLink>
              </SubmenuItem>
              <SubmenuItem>
                <InlineLink as={Link} to='/blog/all/1' onClick={() => setShowSubmenus(false)}>
                  {t('reusable:navigation.blog')}
                </InlineLink>
              </SubmenuItem>
              <SubmenuItem>
                <InlineLink as={Link} to='/contact-us' onClick={() => setShowSubmenus(false)}>
                  {t('reusable:navigation.contact')}
                </InlineLink>
              </SubmenuItem>
            </Submenu>
          </MenuItem>
          <MenuItem showSubmenus={showSubmenus} onMouseOver={() => setShowSubmenus(true)}>
            {currentUserIn ? <MenuAvatar size='sm' src={avatar || noAvatar} /> : <UserRound fill='white' height={6} />}
            <Submenu>
              {currentUserIn ? (
                <>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/user-page' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.user-page')}
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/all-bookings' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.bookings')}
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/messages' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.messages')}
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.settings')}
                    </InlineLink>
                  </SubmenuItem>
                  <MenuDivider />
                  <SubmenuItem>
                    <InlineLink onClick={() => signOut()}>{t('reusable:navigation.logout')}</InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/faq' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.faq')}
                    </InlineLink>
                  </SubmenuItem>
                </>
              ) : (
                <>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/login' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.login')}
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/sign-up' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.signup')}
                    </InlineLink>
                  </SubmenuItem>
                  <SubmenuItem>
                    <InlineLink as={Link} to='/faq' onClick={() => setShowSubmenus(false)}>
                      {t('reusable:navigation.faq')}
                    </InlineLink>
                  </SubmenuItem>
                </>
              )}
              <MenuDivider />
              <LanguageSwitcher />
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
