import { StyledLinkIcon } from './styles';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { colors } = theme;

const LinkIcon = ({ onHoverFill, ...rest }) => {
  return <StyledLinkIcon onHoverFill={onHoverFill} {...rest} />;
};

LinkIcon.defaultProps = {
  onHoverFill: 'primary',
};

LinkIcon.propTypes = {
  onHoverFill: PropTypes.oneOf(Object.keys(colors)),
};

export default LinkIcon;
