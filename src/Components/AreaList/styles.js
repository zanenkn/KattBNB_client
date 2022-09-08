import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container, ContentWrapper } from '../../UI-Components';

const { screens, spacing } = theme;

export const Grid = styled(Container)`
  column-gap: ${spacing[10]};
  grid-template-columns: repeat(2, minmax(0, 1fr));
  display: grid;

  @media screen and (min-width: ${screens.sm}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media screen and (min-width: ${screens.md}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media screen and (min-width: ${screens.lg}) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    column-gap: 9rem;
  }
`;

export const WideContentWrapper = styled(ContentWrapper)`
  max-width: ${screens.lg};
`;
