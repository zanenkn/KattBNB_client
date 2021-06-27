import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import PropTypes from 'prop-types';

const { colors, spacing, screens } = theme;

const Styled = styled.div`
  background-color: ${({ nature }) => colors[nature][20]};
  text-align: left;
  margin-bottom: ${({ space }) => spacing[space]};
  padding: ${spacing[6]};
  @media screen and (min-width: ${screens.sm}) {
    padding: ${spacing[6]};
  }
  > * {
    color: ${({ nature }) => colors[nature][120]}!important;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

const Notice = ({ nature, space, ...rest }) => {
  return (
    <Styled
      nature={nature}
      space={space}
      {...rest}
    />
  );
};

Notice.defaultProps = {
  space: 6,
};

Notice.propTypes = {
  nature: PropTypes.oneOf(['success', 'danger', 'info']).isRequired,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Notice;