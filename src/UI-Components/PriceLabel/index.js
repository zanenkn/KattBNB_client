import { StyledPriceLabel } from './styles';
import PropTypes from 'prop-types';

const PriceLabel = ({ available, ...rest }) => {
  return <StyledPriceLabel available={available} {...rest} />;
};

export default PriceLabel;

PriceLabel.defaultProps = {
  available: false,
};

PriceLabel.propTypes = {
  available: PropTypes.bool,
};
