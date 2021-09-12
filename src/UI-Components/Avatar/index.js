import PropTypes from 'prop-types';
import { StyledAvatar } from './styles';

const Avatar = ({ centered, size, ...rest }) => {
  return <StyledAvatar centered={centered} size={size} {...rest} />;
};

Avatar.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  centered: PropTypes.bool
};

Avatar.defaultProps = {
  size: 'xl',
  centered: false
};

Avatar.displayName = 'Avatar';

export default Avatar;
