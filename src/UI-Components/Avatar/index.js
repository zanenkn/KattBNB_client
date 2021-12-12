import PropTypes from 'prop-types';
import { StyledAvatar } from './styles';
import { theme } from '../../Styles/theme';

const { spacing } = theme;

const Avatar = ({ centered, size, space, ...rest }) => {
  return <StyledAvatar centered={centered} size={size} space={space} {...rest} />;
};

Avatar.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  centered: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

Avatar.defaultProps = {
  size: 'xl',
  centered: false,
  space: 0,
};

Avatar.displayName = 'Avatar';

export default Avatar;
