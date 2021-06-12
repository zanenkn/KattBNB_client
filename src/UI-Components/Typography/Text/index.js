import styled from 'styled-components';
import { theme } from '../../../Styles/theme';

const Styled = styled.p`
  color: ${(props) => props.color || props.theme.colors.base};
  text-align: ${(props) => (props.centered ? 'center' : props.right ? 'right' : 'left')};
  font-weight: ${(props) => (props.bold ? '700' : '400')};
  margin-bottom: ${(props) => props.space};
`;

const Text = ({ color, centered, right, bold, space, ...rest }) => {
  return (
    <Styled
      color={theme.colors[color]}
      centered={centered}
      right={right}
      bold={bold}
      space={theme.spacing[space]}
      {...rest}
    />
  );
};

Text.defaultProps = {
  space: 4,
};

export default Text;
