import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const Styled = styled.h1`
  color: ${(props) => theme.colors[props.color]};
  text-align: ${(props) => (props.centered ? 'center' : 'left')};
  margin-bottom: ${(props) => theme.spacing[props.space]};
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
  color: 'base',
  centered: false,
};

Header.propTypes = {
  level: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),
  color: PropTypes.oneOf(Object.keys(theme.colors)),
  centered: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(theme.spacing).map((key) => parseInt(key))),
};

export default Header;
