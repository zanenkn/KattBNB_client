import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, fontWeights } = theme;

const Styled = styled.a`
  color: ${({ color }) => colors[color][100]};
  font-weight: ${fontWeights.bold};
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ disabled }) =>
    !disabled &&
    `&:hover {
    color: ${({ color }) => colors[color][110]};
    text-decoration: underline;
  }`}
`;

const InlineLink = ({ color, disabled, to, ...rest }) => {
  return <Styled color={color} disabled={disabled} to={disabled ? '#' : to} {...rest} />;
};

InlineLink.defaultProps = {
  color: 'primary',
  disabled: false,
};

InlineLink.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  disabled: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

export default InlineLink;
