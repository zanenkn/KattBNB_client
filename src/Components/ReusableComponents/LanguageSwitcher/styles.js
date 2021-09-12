import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Flexbox, Text } from '../../../UI-Components';

const { fontWeights, spacing } = theme;

export const StyledFlexbox = styled(Flexbox)``;

export const MainLabel = styled(Flexbox)`
  cursor: pointer;
  > p {
    margin: 0 0 0 ${spacing[2]};
    font-weight: ${fontWeights.bold};
  }
`;

export const Options = styled.div`
  max-height: ${({ show }) => (show ? '100px' : '0px')};
  height: auto;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
`;

export const Option = styled(Flexbox)`
  cursor: pointer;
  margin: ${spacing[4]} 0 0 0;
  > svg {
    visibility: ${({ check }) => (check ? 'visible' : 'hidden')};
  }
  > p {
    font-weight: ${({ check }) => (check ? fontWeights.bold : fontWeights.regular)};
    margin: 0 0 0 ${spacing[2]};
  }
`;
