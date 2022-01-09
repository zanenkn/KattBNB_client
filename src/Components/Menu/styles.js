import styled, { keyframes } from 'styled-components';
import { theme } from '../../Styles/theme';

const { colors, spacing } = theme;

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing[6]} ${spacing[6]} ${spacing[6]};
  position: fixed;
  width: 100%;
  z-index: 99999;
  box-sizing: border-box;
  background-color: ${colors['neutral'][20]};
  height: calc(var(--vh, 1vh) * 100);
  top: 0;
  > button {
    box-sizing: content-box;
    display: block;
    width: 24px;
    height: 24px;
    padding: 0;
    align-self: flex-end;
    float: left;
    background: none;
    border: none;
  }
  animation-name: ${({ visible }) => (visible ? slideIn : slideOut)};
  animation-duration: 0.2s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

const slideIn = keyframes`
  from {
    left: 100%;
  }
  to {
    left: 0;
  }
`;

const slideOut = keyframes`
  from {
    left: 0;
  }
  to {
    left: 100%;
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
