import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing, screens, colors } = theme;

export const StyledSecondaryStickyHeader = styled.div`
  margin: 0;
  padding: ${({ padding }) => spacing[padding]} ${spacing[6]};
  height: ${({ height }) => height}px;
  box-sizing: border-box;
  position: fixed;
  background: white;
  width: 100%;
  z-index: 100;
  box-shadow: 0 0 20px -5px rgba(0, 0, 0, 0.2);
  top: 60px;
  @media (min-height: ${screens.md}) {
    top: 75px;
  }
  @media (min-height: ${screens.lg}) {
    top: 90px;
  }
`;
