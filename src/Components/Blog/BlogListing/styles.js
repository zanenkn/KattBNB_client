import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Text, Container } from '../../../UI-Components';

const { spacing, colors } = theme;

export const CurrentPageNumber = styled(Text)`
  font-size: 18px;
`

export const NavigationWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`