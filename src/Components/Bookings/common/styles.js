import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import { ContentWrapper, Container, Flexbox } from '../../../UI-Components';

const { spacing, colors } = theme;

export const StyledContentWrapper = styled(ContentWrapper)`
  padding-top: ${({ padding }) => padding}px;
`;

export const SectionWrapper = styled.div`
  padding-top: ${spacing[6]};
  max-width: 560px;
  margin: auto;
`;

export const BookingContainer = styled(Container)`
  background-color: ${colors.neutral[20]};
  padding: ${spacing[6]};
  margin-bottom: ${spacing[8]};
`;

export const BookingLinks = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${spacing[5]};
`;

export const ScrollToTop = styled.div`
  position: fixed;
  bottom: 0px;
  z-index: 300;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  > svg {
    display: ${({ show }) => (show ? 'block' : 'none')};
    fill: ${colors.neutral[60]};
    transition: all 0.5s ease;
  }
  &:hover > svg {
    fill: ${colors.neutral[80]};
  }
`;

export const PopupHeaderWrapper = styled.div`
  margin: -${spacing[6]} -${spacing[6]} ${spacing[6]};
  background: ${colors.primary[100]};
  padding: ${spacing[6]};
  > :last-child {
    margin-bottom: 0;
  }
`;

export const FlexWrapper = styled(Flexbox)`
  justify-content: start;
  margin-bottom: ${spacing[4]};
  > img {
    margin: 0 ${spacing[2]} 0 0;
  }
  > h5 {
    margin: 0;
  }
`;

export const BoxShadow = styled(Container)`
  box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 560px;
`;

export const Section = styled(Container)`
  ${({ top, neutral }) =>
    top
      ? css`
          background: ${neutral ? colors.neutral[60] : colors.primary[100]};
          > * {
            color: ${colors.white[100]};
          }
        `
      : css`
          background: ${colors.white[100]};
        `}
  padding: ${spacing[6]};
  margin-bottom: 0;
`;
