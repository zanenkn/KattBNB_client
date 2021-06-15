import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, spacing } = theme;

const Styled = styled.h1`
  color: ${({ color }) => colors[color][100]};
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  margin-bottom: ${({ space }) => spacing[space]};
`;

const Header = ({ level, color, centered, space, ...rest }) => {
  return (
    <Styled
      as={`h${level}`}
      color={color}
      centered={centered}
      space={typeof space !== 'undefined' ? space : 8 - level}
      {...rest}
    />
  );
};

Header.defaultProps = {
  level: 1,
  color: 'neutral',
  centered: false,
};

Header.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5]),
  color: PropTypes.oneOf(Object.keys(colors)),
  centered: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Header;
