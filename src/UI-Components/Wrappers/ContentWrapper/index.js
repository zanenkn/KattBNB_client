import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing, screens } = theme;

const Styled = styled.div`
  box-sizing: border-box;
  padding: ${({ theme: { spacing } }) => spacing[6]};

  > *:last-child {
    margin-bottom: 0;
  }

  @media screen and (min-width: ${screens.sm}) {
    padding-left: ${spacing[8]};
    padding-right: ${spacing[8]};
  }

  @media screen and (min-width: ${screens.lg}) {
    padding: ${spacing[8]} 0;
  }

  margin: 0 auto;
  max-width: ${screens.md};
  min-height: calc(var(--vh, 1vh) * 100 - 60px);
  position: relative;
  margin-top: 60px;

  @media screen and (min-height: ${screens.md}) {
    min-height: calc(var(--vh, 1vh) * 100 - 75px);
    margin-top: 75px;
  }
  @media screen and (min-height: ${screens.lg}) {
    min-height: calc(var(--vh, 1vh) * 100 - 90px);
    margin-top: 90px;
  }
`;

const ContentWrapper = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default ContentWrapper;
