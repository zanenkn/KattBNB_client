import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Avatar } from '../../UI-Components';

const { colors, screens, spacing, navbar } = theme;

export const Nav = styled.div`
  height: ${navbar.sm};
  margin: auto;
  background: ${colors.primary[100]};
  display: flex;
  flex-direction: row;
  align-content: center;
  position: fixed;
  top: 0;
  z-index: 5000;
  width: 100%;
  @media (min-height: ${screens.md}) {
    height: ${navbar.md};
  }
  @media (min-height: ${screens.lg}) {
    height: ${navbar.lg};
  }
`;

export const NavInnerWrap = styled.div`
  width: 100%;
  max-width: ${screens.lg};
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${spacing[6]};
  @media (min-width: ${screens.md}) {
    padding: 0 ${spacing[10]};
  }
  @media (min-width: ${screens.xl}) {
    padding: 0;
  }
  button {
    border: none;
    display: flex;
    background-color: transparent;
  }
`;

export const Navlink = styled.div`
  padding: 0 !important;
  width: unset !important;
  float: right;
  margin: auto 0 auto auto;
  position: relative;
`;

export const IconWrapper = styled.div`
  display: flex;
  flex-disrection: row;
  width: 100%;
`;

export const MenuDivider = styled.hr`
  margin: ${spacing[4]} 0;
  border: ${colors.neutral[100]} solid 1px;
`;

export const MenuAvatar = styled(Avatar)`
  padding: 1px;
  border: white solid 2px;
  box-sizing: border-box;
  margin: 3px 0;
`;