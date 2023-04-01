import { Styled } from './styles';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { spacing } = theme;

const PrismicRichText = ({ space, ...rest }) => {
  return <Styled space={space} {...rest} />;
};

export default PrismicRichText;

Text.defaultProps = {
  space: 10,
};

PrismicRichText.propTypes = {
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};
