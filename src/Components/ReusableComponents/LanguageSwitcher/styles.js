import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import { Flexbox, Text } from '../../../UI-Components';

const { fontWeights, fontSize, colors, spacing } = theme;

export const StyledFlexbox = styled(Flexbox)`
  cursor: pointer;
`

export const MainLabel = styled(Text)`
  margin: 0 0 0 ${spacing[2]};
  font-weight: ${fontWeights.bold};
`

export const Options = styled.div`
  max-height: ${({ show }) => (show ? '100px' : '0px')};
  height: auto;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
`

export const Option = styled(Text)`
  margin: 1rem 0 0 0;
`