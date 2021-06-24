import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';
import { inherits } from 'util';

const { colors, fontWeights, fontSize } = theme;

const Styled = styled.a`
  color: ${({ color, discreet }) => colors[color][discreet ? 60 : 100]};
  font-weight: ${fontWeights.bold};
  font-size: ${({ text }) => (text ? fontSize[text] : 'inherit')};
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ disabled }) =>
    !disabled &&
    css`
      &:hover {
        color: ${({ color, discreet }) => colors[color][discreet ? 80 : 110]};
        text-decoration: underline;
      }
    `}
`;

const InlineLink = ({ color, disabled, discreet, text, to, ...rest }) => {
  return (
    <Styled color={color} disabled={disabled} discreet={discreet} text={text} to={disabled ? '#' : to} {...rest} />
  );
};

InlineLink.defaultProps = {
  color: 'primary',
  disabled: false,
  discreat: false,
};

InlineLink.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  disabled: PropTypes.bool,
  discreet: PropTypes.bool,
  text: PropTypes.oneOf(Object.keys(fontSize)),
  to: PropTypes.string,
};

export default InlineLink;
