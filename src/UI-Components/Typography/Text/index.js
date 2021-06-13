import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const Styled = styled.p`
  color: ${(props) => theme.colors[props.color]};
  text-align: ${(props) => (props.centered ? 'center' : props.right ? 'right' : 'left')};
  font-weight: ${(props) => (props.bold ? '700' : '400')};
  margin-bottom: ${(props) => props.space};
`;

const Text = ({ color, centered, right, bold, space, ...rest }) => {
  return <Styled color={color} centered={centered} right={right} bold={bold} space={theme.spacing[space]} {...rest} />;
};

Text.defaultProps = {
  color: 'base',
  centered: false,
  right: false,
  bold: false,
  space: 4,
};

Text.propTypes = {
  color: PropTypes.oneOf(Object.keys(theme.colors)),
  centered: PropTypes.bool,
  right: PropTypes.bool,
  bold: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(theme.spacing).map((key) => parseInt(key))),
};

export default Text;
