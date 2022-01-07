import styled, { css } from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing, screens } = theme;

const sizes = {
  xs: spacing[5],
  sm: spacing[6],
  md: spacing[8],
  lg: spacing[18],
  xl: '150px',
};

const smallSizes = {
  xs: spacing[5],
  sm: spacing[5],
  md: spacing[6],
  lg: spacing[12],
  xl: '100px',
}

export const StyledAvatar = styled.img`
  border-radius: 50%;
  width: ${({ size }) => sizes[size]};
  height: ${({ size }) => sizes[size]};
  ${({ responsive }) =>
    responsive &&
    css`
      @media (max-width: ${screens.md}) {
        width: ${({ size }) => smallSizes[size]};
        height: ${({ size }) => smallSizes[size]};
      }
    `}
  display: block;
  ${({ centered }) =>
    centered &&
    css`
      margin: auto;
    `}
  margin-bottom: ${({ space }) => spacing[space]};
`;
