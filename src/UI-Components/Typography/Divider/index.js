import PropTypes from 'prop-types';
import { StyledDivider } from './styles';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

const Divider = ({ color, margin, ...rest }) => {
  return <StyledDivider color={color} margin={margin} {...rest} />;
};

Divider.defaultProps = {
  color: 'neutral',
  margin: 4,
};

Divider.propTypes = {
  color: PropTypes.oneOf(Object.keys(colors)),
  margin: PropTypes.oneOf(Object.keys(spacing)),
};

export default Divider;
