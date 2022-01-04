import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing, screens, navbar } = theme;

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
  min-height: calc(var(--vh, 1vh) * 100 - ${navbar.sm});
  position: relative;
  margin-top: ${navbar.sm};

  @media screen and (min-height: ${screens.md}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.md});
    margin-top: ${navbar.md};
  }
  @media screen and (min-height: ${screens.lg}) {
    min-height: calc(var(--vh, 1vh) * 100 - ${navbar.lg});
    margin-top: ${navbar.lg};
  }
`;

const ContentWrapper = ({ ...rest }) => {
  return <Styled {...rest} />;
};

export default ContentWrapper;
