import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing } = theme;

export const LoadingPaymentWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  backdrop-filter: blur(2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${spacing[6]};
  box-sizing: border-box;
`;
