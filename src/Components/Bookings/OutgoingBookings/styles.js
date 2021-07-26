import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { ContentWrapper, Container } from '../../../UI-Components';

const { spacing, screens, colors, fontWeights } = theme;

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
