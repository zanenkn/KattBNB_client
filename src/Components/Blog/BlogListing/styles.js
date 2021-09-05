import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Text, Container } from '../../../UI-Components';

const { spacing, colors, fontSize } = theme;

export const CurrentPageNumber = styled(Text)`
  font-size: ${fontSize.lg};
  margin: 0 ${spacing[4]};
  color: ${colors.neutral[100]};
`;

export const NavigationWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > a > svg {
    display: flex;
    fill: ${colors.neutral[60]};
    transition: all 0.5s ease;
  }
  > a:hover > svg {
    fill: ${colors.neutral[80]};
  }
`;
