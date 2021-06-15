import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, fontWeights } = theme;

const Styled = styled.a`
  color: ${({ color }) => colors[color][100]};
  font-weight: ${fontWeights.bold};
  &:hover {
    color: ${({ color }) => colors[color][110]};
    text-decoration: underline;
  }
`;

const InlineLink = ({ color, ...rest }) => {
  return <Styled color={color} {...rest} />;
};

InlineLink.defaultProps = {
  color: 'primary',
};

InlineLink.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
};

export default InlineLink;
