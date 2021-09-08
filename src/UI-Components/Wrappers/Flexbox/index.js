import { StyledFlexbox } from './styles';
import PropTypes from 'prop-types';

const Flexbox = ({ direction, height, horizontalAlign, verticalAlign, width, ...rest }) => {
  return (
    <StyledFlexbox
      direction={direction}
      height={height}
      horizontalAlign={horizontalAlign}
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
  verticalAlign: PropTypes.oneOf(['top', 'bottom', 'center']),
  width: PropTypes.string,
};

Flexbox.defaultProps = {
  direction: 'row',
  height: 'auto',
  horizontalAlign: 'center',
  verticalAlign: 'center',
  width: 'auto',
};

Flexbox.displayName = 'Flexbox';

export default Flexbox;
