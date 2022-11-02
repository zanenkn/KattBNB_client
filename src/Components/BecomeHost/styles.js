import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { ContentWrapper, Container, Button, InlineLink } from '../../UI-Components';

const { screens, spacing } = theme;

export const StyledContentWrapper = styled(ContentWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const VideoWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  padding-top: ${spacing[4]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: max-content;
  width: 100%;
  max-width: 500px;

  @media screen and (min-width: 425px) {
    width: 425px;
    padding-top: ${spacing[8]};
  }
  @media screen and (min-width: ${screens['lg']}) {
    width: 450px;
  }
`;

export const AbsoluteContainer = styled(Container)`
  position: absolute;
  bottom: 30%;
  width: 100%;
`;

export const StyledButton = styled(Button)`
  opacity: ${({ videoEnded }) => (videoEnded ? '1' : '0')};
`;

export const SkipLink = styled(InlineLink)`
  opacity: ${({ videoEnded }) => (videoEnded ? '0' : '1')};
  bottom: ${({ videoEnded }) => (videoEnded ? '3rem' : '0')};
  transition: all 0.35s ease-in-out;
  text-transform: uppercase;
`;
