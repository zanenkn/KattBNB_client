import PropTypes from 'prop-types';
import { StyledDivider } from './styles';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

const Divider = ({ color, top, bottom, thick, ...rest }) => {
  return <StyledDivider color={color} bottom={bottom} top={top} thick={thick} {...rest} />;
};

Divider.defaultProps = {
  bottom: 4,
  color: 'neutral',
  top: 4,
  thick: false
};

Divider.propTypes = {
  bottom: PropTypes.oneOf(Object.keys(spacing).map(k => +k)),
  color: PropTypes.oneOf(Object.keys(colors)),
  top: PropTypes.oneOf(Object.keys(spacing).map(k => +k)),
  thick: PropTypes.bool,
};

export default Divider;
