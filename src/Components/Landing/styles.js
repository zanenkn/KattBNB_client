import styled, { keyframes } from 'styled-components';
import { spacing } from '../../icons/constants';
import { theme } from '../../Styles/theme';

const { navbar, screens } = theme;

export const LandingHeroMobile = styled.div`
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  height: calc(${({ unit }) => unit} * 100 - ${navbar.sm});
  position: relative;
  margin-top: ${navbar.sm};

  img {
    width: 100vw;
    height: calc(${({ unit }) => unit} * 100 - ${navbar.sm});
    object-fit: cover;
  }

  @media screen and (min-height: ${screens.md}) {
    height: calc(${({ unit }) => unit} * 100 - ${navbar.md});
    margin-top: ${navbar.md};
    img {
      height: calc(${({ unit }) => unit} * 100 - ${navbar.md});
    }
  }
  @media screen and (min-height: ${screens.lg}) {
    height: calc(${({ unit }) => unit} * 100 - ${navbar.lg});
    margin-top: ${navbar.lg};
    img {
      height: calc(${({ unit }) => unit} * 100 - ${navbar.lg});
    }
  }
`;

const jump = keyframes`
  0%, 100%, 20%, 50%, 80% {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }
  40% {
    -webkit-transform: translateY(-10px);
    -ms-transform: translateY(-10px);
    transform: translateY(-10px);
  }
  60% {
    -webkit-transform: translateY(-5px);
    -ms-transform: translateY(-5px);
    transform: translateY(-5px);
  }
`;

export const JumpyArrow = styled.div`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  display: flex;
  justify-content: center;
  opacity: 1;
  -webkit-animation: jump 2s infinite 2s;
  animation: ${jump} 2s infinite 2s;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  transform: scale(1);
  margin-bottom: ${spacing[2]};

  &:before {
    position: absolute;
    top: calc(50% - 8px);
    left: calc(50% - 6px);
    display: block;
    width: 12px;
    height: 12px;
    content: '';
  }
  > svg {
    transform: rotate(180deg);
  }
`;

export const HeroTextMobile = styled.div`
  padding: ${spacing[6]};
`;

export const LandingHeroDesktop = styled.div`
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(Kisse_desktop.jpg);
  position: relative;

  margin-top: ${navbar.sm};

  @media screen and (min-height: ${screens.md}) {
    margin-top: ${navbar.md};
  }
  @media screen and (min-height: ${screens.lg}) {
    margin-top: ${navbar.lg};
  }
`;

export const InnerDesktop = styled.div`
  max-width: 1024px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  @media screen and (min-width: 768px) {
    padding: 4rem 4rem;
  }
  @media screen and (min-width: 1024px) {
    padding: 6rem 4rem;
  }
`;

export const HeroTextDesktop = styled.div`
  width: 35%;
`;
