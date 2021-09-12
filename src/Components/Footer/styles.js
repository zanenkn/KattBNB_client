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
  padding: ${spacing[6]} 0;
  display: grid;
  max-width: ${screens.md};
  list-style: none;
  margin: auto;
  padding-inline-start: 0;
  grid-template-columns: 150px;
  row-gap: ${spacing[6]};
  justify-content: center;

  @media (min-width: 420px) {
    padding: ${spacing[6]};
    max-width: ${screens.md};
    column-gap: ${spacing[6]};
    row-gap: ${spacing[8]};
    grid-template-columns: 150px 150px;
  }

  @media (min-width: ${screens.sm}) {
    padding: ${spacing[6]} ${spacing[8]};

    column-gap: ${spacing[10]};
    max-width: ${screens.sm};
  }

  @media (min-width: ${screens.md}) {
    padding: ${spacing[6]} ${spacing[8]};
    grid-template-columns: auto auto auto 100px;
    max-width: ${screens.md};
    justify-content: unset;
  }

  @media screen and (min-width: ${screens.lg}) {
    padding: ${spacing[8]} 0;
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
  flex-direction: column-reverse;
  @media (min-width: ${screens.sm}) {
    flex-direction: row;
    justify-content: space-between;
  }
  > *:last-child {
    margin-top: ${spacing[2]};
    margin-bottom: ${spacing[5]};
  }
  @media (min-width: ${screens.sm}) {
    > *:last-child {
      margin: 0;
    }
  }
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
`;
