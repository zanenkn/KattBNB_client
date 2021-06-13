import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { spacing } = theme;

const Styled = styled.div`
  margin-bottom: ${({ space }) => spacing[space]};
`;

const Container = ({ space, ...rest }) => {
  return <Styled space={space} {...rest} />;
};

Container.defaultProps = {
  space: 4,
};

Container.propTypes = {
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Container;
