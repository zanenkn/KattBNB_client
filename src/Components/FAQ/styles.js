import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

export const IconWrapper = styled.div`
  transform: ${({ active }) => (active ? 'rotate(90deg)' : 'rotate(0)')};
  transition: transform 0.25s ease-in-out;
`;

export const TextWrapper = styled.div`
  margin: ${spacing[2]} 0 0 ${spacing[6]};
`;
