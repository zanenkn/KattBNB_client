import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors } = theme;

export const Styled = styled.strong`
  color: ${({ color }) => colors[color][100]};
`;
