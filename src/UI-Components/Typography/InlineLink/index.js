import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, fontWeights, fontSize } = theme;

const Styled = styled.a`
  color: ${({ color }) => colors[color][100]};
  font-weight: ${fontWeights.bold};
  font-size: ${({text}) => fontSize[text]};
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ disabled }) =>
    !disabled &&
    `&:hover {
    color: ${({ color }) => colors[color][110]};
    text-decoration: underline;
  }`}
`;

const InlineLink = ({ color, disabled, text, to, ...rest }) => {
  return <Styled color={color} disabled={disabled} text={text} to={disabled ? '#' : to} {...rest} />;
};

InlineLink.defaultProps = {
  color: 'primary',
  disabled: false,
  text: 'base',
};

InlineLink.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  disabled: PropTypes.bool,
  text: PropTypes.oneOf(Object.keys(fontSize)),
  to: PropTypes.string,
};

export default InlineLink;
