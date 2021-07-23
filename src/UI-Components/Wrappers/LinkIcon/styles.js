import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors } = theme;

export const StyledLinkIcon = styled.a`
  > svg {
    transition: all 0.5s ease;
  }

  &:hover > svg {
    fill: ${({ onHoverFill }) => colors[onHoverFill][100]};
  }
`;
