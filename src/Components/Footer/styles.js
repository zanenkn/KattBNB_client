import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { ContentWrapper } from '../../UI-Components';

const { colors, screens, spacing } = theme;

export const StyledFooter = styled.div`
  width: 100%;
  background-color: ${colors.neutral[80]};
  color: ${colors.white[100]};
`;

export const FooterInnerWrap = styled(ContentWrapper)`
  margin-top: 0;
  min-height: unset;
`;

export const ColumnGrid = styled.ul`
  display: grid;
  max-width: ${screens.md};
  list-style: none;
  margin: auto;
  padding-inline-start: 0;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  @media (min-width: ${screens.sm}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: ${screens.md}) {
    grid-template-columns: auto auto auto 100px;
  }
  * {
    color: ${colors.white[100]};
  }

  > li > ul {
    list-style: none;
    padding-inline-start: 0;
  }
`;
