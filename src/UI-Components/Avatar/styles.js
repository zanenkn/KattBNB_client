import styled, {css} from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

const sizes = {
  xs: spacing[5],
  sm: spacing[6],
  md: spacing[12],
  lg: spacing[18],
  xl: '150px',
}

export const StyledAvatar = styled.img`
  border-radius: 50%;
  width: ${({size}) => sizes[size]};
  height: ${({size}) => sizes[size]};
  display: block;
  ${({centered}) => centered && css`margin: auto;`}
`;