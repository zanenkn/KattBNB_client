import styled from 'styled-components';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

export const ReplyWrapper = styled.div`
  padding-left: ${({right}) => spacing[right]};
`

export const ReplyFormWrapper = styled.div`
  max-height: ${({open}) => open ? '500px' : '0px'};
  height: auto;
  overflow: hidden;
  transition: max-height 1s ease-in-out;
`