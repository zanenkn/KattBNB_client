import { StyledSecondaryStickyHeader } from './styles';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { spacing } = theme;

const SecondaryStickyHeader = ({ height, padding, ...rest }) => {
  return <StyledSecondaryStickyHeader height={height} padding={padding} {...rest} />;
};

export default SecondaryStickyHeader;

SecondaryStickyHeader.defaultProps = {
  height: 150,
  padding: '4',
};

SecondaryStickyHeader.propTypes = {
  height: PropTypes.number,
  padding: PropTypes.oneOf(Object.keys(spacing)),
};
