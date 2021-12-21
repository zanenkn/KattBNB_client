import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

export const MapWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: ${spacing[4]};
`;
