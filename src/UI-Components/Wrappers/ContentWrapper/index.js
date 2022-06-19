import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';

const { spacing, screens, navbar } = theme;

const Styled = styled.div`
  box-sizing: border-box;
  padding-right: ${() => spacing[6]};
  padding-left: ${() => spacing[6]};
  padding-bottom: ${({ noBottomPadding }) => (noBottomPadding ? '0' : spacing[6])};
  ${({ top }) =>
    top &&
    css`
      padding-top: ${top}px;
    `}

  > *:last-child {
    margin-bottom: 0;
  }

  @media screen and (min-width: ${screens.sm}) {
    padding-left: ${spacing[8]};
    padding-right: ${spacing[8]};
  }

  @media screen and (min-width: ${screens.lg}) {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${({ noBottomPadding }) => (noBottomPadding ? '0' : spacing[8])};
    ${({ top }) =>
      top
        ? css`
            padding-top: ${top}px;
          `
        : css`
            padding-top: ${spacing[8]};
          `}
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

const ContentWrapper = ({ top, noBottomPadding, ...rest }) => {
  return <Styled top={top} noBottomPadding={noBottomPadding} {...rest} />;
};

ContentWrapper.propTypes = {
  top: PropTypes.number,
  noBottomPadding: PropTypes.bool,
};

ContentWrapper.defaultProps = {
  noBottomPadding: false,
};

export default ContentWrapper;
