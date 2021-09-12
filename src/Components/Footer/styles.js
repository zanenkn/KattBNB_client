import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import { Flexbox } from '../../UI-Components';

const { colors, screens, spacing } = theme;

export const StyledFooter = styled.div`
  width: 100%;
  background-color: ${colors.neutral[80]};
  color: ${colors.white[100]};
`;

export const FooterInnerWrap = styled.div`
  max-width: ${screens.lg};
  margin: auto;
  padding: 0 ${spacing[6]} ${spacing[8]};
  @media (min-width: ${screens.md}) {
    padding: 0 ${spacing[10]} ${spacing[8]};
  }
  @media screen and (min-width: ${screens.lg}) {
    padding-bottom: ${spacing[10]};
  }
  @media (min-width: ${screens.xl}) {
    padding: 0 0 ${spacing[10]};
  }
`;

export const ColumnGrid = styled.ul`
  box-sizing: border-box;
  padding: ${spacing[6]};

  @media screen and (min-width: ${screens.sm}) {
    padding-left: ${spacing[8]};
    padding-right: ${spacing[8]};
  }

  @media screen and (min-width: ${screens.lg}) {
    padding: ${spacing[8]} 0;
  }

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

export const BottomFlexbox = styled(Flexbox)`
  justify-content: space-between;
`;

export const SocialWrapper = styled(Flexbox)`
  > * {
    margin-right: ${spacing[4]};
  }
  > *:last-child {
    margin-right: 0;
  }
  > a {
    line-height: 0;
  }
`