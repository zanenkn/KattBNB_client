import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, fontWeights, spacing } = theme;

const Styled = styled.p`
  color: ${({ color }) => colors[color]};
  text-align: ${({ centered, right }) => (centered ? 'center' : right ? 'right' : 'left')};
  font-weight: ${({ bold }) => (bold ? fontWeights.bold : fontWeights.regular)};
  margin-bottom: ${({ space }) => space};
`;

const Text = ({ color, centered, right, bold, space, ...rest }) => {
  return <Styled color={color} centered={centered} right={right} bold={bold} space={spacing[space]} {...rest} />;
};

Text.defaultProps = {
  color: 'base',
  centered: false,
  right: false,
  bold: false,
  space: 4,
};

Text.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  centered: PropTypes.bool,
  right: PropTypes.bool,
  bold: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Text;
