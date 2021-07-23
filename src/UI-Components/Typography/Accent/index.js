import PropTypes from 'prop-types';
import { Styled } from './styles';
import { theme } from '../../../Styles/theme';

const { colors } = theme;

const Accent = ({ color, ...rest }) => {
  return <Styled color={color} {...rest} />;
};

Accent.defaultProps = {
  color: 'neutral',
};

Accent.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
};

export default Accent;
