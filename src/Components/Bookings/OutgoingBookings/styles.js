import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { ContentWrapper } from '../../../UI-Components';

const { spacing, screens, colors, fontWeights } = theme;

export const StyledContentWrapper = styled(ContentWrapper)`
  padding-top: ${({ padding }) => padding}px;
`;
