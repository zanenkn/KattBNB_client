import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

export const ReversibleWrapper = styled.div`
  display: flex;
  flex-direction: ${({ revert }) => (revert ? 'column-reverse' : 'column')};
  align-items: center;
  margin-bottom: ${spacing[4]};
`;
