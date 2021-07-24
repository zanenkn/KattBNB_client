import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { colors, screens } = theme;

export const Nav = styled.div`
  height: 60px;
  margin: auto;
  background: #c90c61;
  display: flex;
  flex-direction: row;
  align-content: center;
  position: fixed;
  top: 0;
  z-index: 5000;
  width: 100%;
  @media (min-height: ${screens.md}) {
    height: 75px;
  }
  @media (min-height: ${screens.lg}) {
    height: 90px;
  }
`;

export const NavInnerWrap = styled.div`
  width: 100%;
  max-width: 288px;
  margin: auto;
  display: flex;
  flex-direction: row;
  @media (min-width: 375px) {
    max-height: 343px;
  }
  @media (min-width: 425px) {
    max-width: 393px;
  }
  @media (min-width: 768px) {
    max-width: 688px;
  }
  @media (min-width: 1024px) {
    max-width: 944px;
  }
  @media (min-width: 1440px) {
    max-width: 1200px;
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
