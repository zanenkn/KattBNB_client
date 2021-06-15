import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, fontWeights, fontSize, spacing } = theme;

const Styled = styled.p`
  color: ${({ color }) => colors[color][100]};
  text-align: ${({ centered, right }) => (centered ? 'center' : right ? 'right' : 'left')};
  font-weight: ${({ bold }) => (bold ? fontWeights.bold : fontWeights.regular)};
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  margin-bottom: ${({ space }) => space};
  font-size: ${({ size }) => size};
`;

const Text = ({ color, centered, right, bold, italic, space, size, ...rest }) => {
  return (
    <Styled
      color={color}
      centered={centered}
      right={right}
      bold={bold}
      italic={italic}
      space={spacing[space]}
      size={fontSize[size]}
      {...rest}
    />
  );
};

Text.defaultProps = {
  color: 'neutral',
  centered: false,
  right: false,
  bold: false,
  italic: false,
  space: 4,
  size: 'base',
};

Text.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  centered: PropTypes.bool,
  right: PropTypes.bool,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  size: PropTypes.string,
};

export default Text;
