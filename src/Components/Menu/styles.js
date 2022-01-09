import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { colors, spacing, navbar, screens } = theme;

export const MenuWrapper = styled.div`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[6]} 0;
  position: fixed;
  width: 100%;
  z-index: 99999;
  box-sizing: border-box;
  background-color: ${colors['neutral'][20]};
  height: calc(var(--vh, 1vh) * 100 - ${navbar.sm});
  top: ${navbar.sm};
  @media screen and (min-height: ${screens.md}) {
    height: calc(var(--vh, 1vh) * 100 - ${navbar.md});
    top: ${navbar.md};
  }
`;

export const MenuLink = styled.a`
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

export const SwitcherWrapper = styled.div`
  height: 130px;
  width: 150px;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
