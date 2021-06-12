import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const Styled = styled.h1`
  color: ${(props) => props.color || props.theme.colors.base};
  text-align: ${(props) => (props.centered ? 'center' : 'left')};
  margin-bottom: ${(props) => theme.spacing[props.space]};
`;

const Header = ({ level, color, centered, space, ...rest }) => {
  return (
    <Styled
      as={`h${level}`}
      color={theme.colors[color]}
      centered={centered}
      space={typeof space !== 'undefined' ? space : 8 - level}
      {...rest}
    />
  );
};

Header.defaultProps = {
  level: 1,
  centered: false,
};

export default Header;
