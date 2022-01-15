import styled, { keyframes, css } from 'styled-components';
import { spacing } from '../../icons/constants';
import { theme } from '../../Styles/theme';
import { Text } from '../../UI-Components';

const { navbar, screens, colors } = theme;

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

export const HeroTextDesktop = styled.div`
  width: 35%;
`;

export const LandingItem = styled.div`
  max-width: ${screens.lg};
  margin: auto;

  padding: ${spacing[7]} ${spacing[6]};

  @media screen and (min-width: ${screens.md}) {
    padding: ${spacing[10]} ${spacing[10]};
  }
  @media screen and (min-width: ${screens.lg}) {
    padding: ${spacing[14]} ${spacing[10]};
  }
`;

export const InnerDesktop = styled(LandingItem)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const LandingSection = styled.div`
  background-color: ${({ color, tint }) => colors[color][tint]};
`;

export const LandingGrid = styled.div`
  display: inline-flex;
  gap: ${spacing[6]};
`;

export const ReviewWrapper = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing[6]};
  min-height: 338px;
  height: fit-content;
  box-sizing: border-box;
`;

export const TextClamper = styled(Text)`
  display: -webkit-box;
  ${({ open }) =>
    open
      ? ''
      : css`
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        `}
`;
