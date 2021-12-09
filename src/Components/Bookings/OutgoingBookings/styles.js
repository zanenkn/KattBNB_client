import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Container } from '../../../UI-Components';

const { spacing } = theme;

export const CenteredTable = styled(Container)`
  margin: 0 auto;
  display: table;
  > div {
    margin-bottom: ${spacing[2]};
  }
`;
