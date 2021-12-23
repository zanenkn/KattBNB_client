import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { fontSize, spacing, fontWeights, colors } = theme;

export const StyledPriceLabel = styled.div`
  background-color: ${({ available }) => (available ? colors['success'][100] : colors['neutral'][80])};
  color: ${colors['white'][100]};
  font-size: ${fontSize['sm']};
  font-weight: ${fontWeights['bold']};
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: 2px;
  white-space: nowrap;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 0;
    border: 7px solid transparent;
    border-top-color: ${({ available }) => (available ? colors['success'][100] : colors['neutral'][80])};
    border-bottom: 0;
    margin-left: -7px;
    margin-bottom: -7px;
  }
`;
