import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

export const StyledDivider = styled.hr`
  margin: ${({ top }) => spacing[top]} 0 ${({ bottom }) => spacing[bottom]};
  border-top: ${({ color, tint }) => colors[color][tint]} solid ${({ thick }) => (thick ? '2px' : '1px')};
  border-bottom: none;
  border-right: none;
  border-left: none;
`;
