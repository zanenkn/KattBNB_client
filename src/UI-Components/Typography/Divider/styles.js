import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

export const StyledDivider = styled.hr`
  margin: ${({ margin }) => spacing[margin]} 0;
  border: ${({ color }) => colors[color][100]} solid 1px;
`;
