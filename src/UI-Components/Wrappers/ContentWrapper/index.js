import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const Styled = styled.div`
  box-sizing: border-box;
  padding: ${theme.spacing[6]} ${theme.spacing[4]};

  @media screen and (min-width: ${theme.screens.sm}) {
    padding-left: ${theme.spacing[8]};
    padding-right: ${theme.spacing[8]};
  }

  @media screen and (min-width: ${theme.screens.lg}) {
    padding: ${theme.spacing[8]} 0;
  }

  margin: 0 auto;
  max-width: ${theme.screens.md};
  min-height: calc(var(--vh, 1vh) * 100 - 60px);
  position: relative;
  margin-top: 60px;

  @media screen and (min-height: 736px) {
    min-height: calc(var(--vh, 1vh) * 100 - 75px);
    margin-top: 75px;
  }
  @media screen and (min-height: 1024px) {
    min-height: calc(var(--vh, 1vh) * 100 - 90px);
    margin-top: 90px;
  }
`;

const ContentWrapper = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default ContentWrapper;
