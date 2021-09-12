import { StyledFlexbox } from './styles';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { spacing } = theme;

const Flexbox = ({ direction, height, horizontalAlign, space, verticalAlign, width, ...rest }) => {
  return (
    <StyledFlexbox
      direction={direction}
      height={height}
      horizontalAlign={horizontalAlign}
      space={space}
      verticalAlign={verticalAlign}
      width={width}
      {...rest}
    />
  );
};

Flexbox.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']),
  height: PropTypes.string,
  horizontalAlign: PropTypes.oneOf(['left', 'right', 'center']),
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  verticalAlign: PropTypes.oneOf(['top', 'bottom', 'center']),
  width: PropTypes.string,
};

Flexbox.defaultProps = {
  direction: 'row',
  height: 'auto',
  horizontalAlign: 'center',
  space: 0,
  verticalAlign: 'center',
  width: 'auto',
};

Flexbox.displayName = 'Flexbox';

export default Flexbox;
