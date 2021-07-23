import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Container } from '../../../UI-Components';

const { spacing, colors } = theme;

export const BoxShadow = styled(Container)`
  box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, 0.2);
  width: 100%;
  @media screen and (min-width: 700px) {
    width: 560px;
  }
`;

export const Section = styled(Container)`
  background: ${({ top }) => (top ? colors.primary[100] : colors.white[100])};
  padding: ${spacing[6]};
  margin-bottom: 0;
`;

export const ReversibleWrapper = styled.div`
  display: flex;
  flex-direction: ${({ revert }) => (revert ? 'column-reverse' : 'column')};
  align-items: center;
`;
