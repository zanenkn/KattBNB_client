import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, fontWeights, fontSize } = theme;

const Styled = styled.a`
  color: ${({ color, $discreet }) => colors[color][$discreet ? 60 : 100]};
  font-weight: ${fontWeights.bold};
  font-size: ${({ text }) => (text ? fontSize[text] : 'inherit')};
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  white-space: ${({ noBreak }) => (noBreak ? 'nowrap' : 'inherit')};
  ${({ disabled }) =>
    !disabled &&
    css`
      &:hover {
        color: ${({ color, $discreet }) => colors[color][$discreet ? 80 : 110]};
        text-decoration: underline;
      }
    `}
`;

const InlineLink = ({ color, disabled, discreet, text, to, noBreak, ...rest }) => {
  return (
    <Styled
      color={color}
      disabled={disabled}
      $discreet={discreet}
      text={text}
      to={disabled ? '#' : to}
      $noBreak={noBreak}
      {...rest}
    />
  );
};

InlineLink.defaultProps = {
  color: 'neutral',
  disabled: false,
  discreet: false,
  noBreak: false,
};

InlineLink.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  disabled: PropTypes.bool,
  discreet: PropTypes.bool,
  text: PropTypes.oneOf(Object.keys(fontSize)),
  to: PropTypes.string,
  noBreak: PropTypes.bool,
};

export default InlineLink;
