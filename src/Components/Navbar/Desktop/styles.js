import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Text } from '../../../UI-Components';

const { fontWeights, colors, spacing } = theme;

export const MenuItem = styled(Text)`
  font-size: 18px;
  color: ${colors.white[100]};
  font-weight: ${fontWeights.bold};
  margin-right: ${spacing[6]};
  margin-bottom: 0;
`;
