import { StyledFlexbox } from './styles';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { spacing } = theme;

const Flexbox = ({
  direction,
  height,
  horizontalAlign,
  space,
  spaceItems,
  spaceItemsX,
  spaceItemsY,
  verticalAlign,
  maxWidth,
  wrap,
  ...rest
}) => {
  return (
    <StyledFlexbox
      direction={direction}
      height={height}
      horizontalAlign={horizontalAlign}
      space={space}
      spaceItems={spaceItems}
      spaceItemsX={spaceItemsX}
      spaceItemsY={spaceItemsY}
      verticalAlign={verticalAlign}
      maxWidth={maxWidth}
      wrap={wrap}
      {...rest}
    />
  );
};

Flexbox.propTypes = {
  direction: PropTypes.oneOf(['row', 'column']),
  height: PropTypes.string,
  horizontalAlign: PropTypes.oneOf(['left', 'right', 'center']),
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  spaceItems: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  spaceItemsX: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  spaceItemsY: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  verticalAlign: PropTypes.oneOf(['top', 'bottom', 'center']),
  maxWidth: PropTypes.string,
  wrap: PropTypes.bool,
};

Flexbox.defaultProps = {
  direction: 'row',
  height: 'auto',
  horizontalAlign: 'center',
  space: 0,
  spaceItems: 0,
  spaceItemsX: 0,
  spaceItemsY: 0,
  verticalAlign: 'center',
  maxWidth: 'unset',
  wrap: false,
};

Flexbox.displayName = 'Flexbox';

export default Flexbox;
