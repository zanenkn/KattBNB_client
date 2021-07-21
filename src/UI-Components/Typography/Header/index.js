import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, spacing } = theme;

const Styled = styled.h1`
  color: ${({ color, tint }) => colors[color][tint]};
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  margin-bottom: ${({ space }) => spacing[space]};
  cursor: ${({ pointer }) => (pointer ? 'pointer' : 'unset')};
  text-decoration: ${({ underlined }) => (underlined ? 'underline' : 'unset')};
`;

const Header = ({ level, color, tint, pointer, centered, underlined, space, ...rest }) => {
  return (
    <Styled
      as={`h${level}`}
      color={color}
      tint={tint}
      centered={centered}
      pointer={pointer}
      underlined={underlined}
      space={typeof space !== 'undefined' ? space : 8 - level}
      {...rest}
    />
  );
};

Header.defaultProps = {
  level: 1,
  color: 'neutral',
  tint: 100,
  centered: false,
  pointer: false,
  underlined: false,
};

Header.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5]),
  color: PropTypes.oneOf(Object.keys(colors)),
  tint: PropTypes.oneOf([100, 80, 60, 40, 20, 10, 0]),
  centered: PropTypes.bool,
  pointer: PropTypes.bool,
  underlined: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Header;
