import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const { spacing, screens } = theme;

const Styled = styled.div`
  position: relative;
  background: #ffffff;
  margin: 0 ${({centered}) => centered ? 'auto' : '0'} ${({ space }) => spacing[space]};
  box-shadow: ${({ responsive }) => (responsive ? 'none' : '0px 0px 20px -5px rgba(0,0,0,0.2)')};
  border: none;
  padding: ${({ responsive, spacing }) => (responsive ? '0' : `${spacing[5]}`)};
  border-radius: 0;
  border: none;
  max-width: 560px;
  box-sizing: border-box;
  display: ${({fixedWidth}) => fixedWidth ? 'block' : 'inline-block'};

  @media screen and (min-width: ${screens.sm}) {
    box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, 0.2);
    padding: ${spacing[6]};
  }

  @media screen and (min-width: ${screens.md}) {
    padding: ${spacing[8]};
  }
`;

const Whitebox = ({ responsive, space, centered, fixedWidth, ...rest }) => {
  return <Styled responsive={responsive} space={space} centered={centered} fixedWidth={fixedWidth} {...rest} />;
};

Whitebox.defaultProps = {
  responsive: true,
  space: 7,
  centered: true,
  fixedWidth: true,
};

Whitebox.propTypes = {
  responsive: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  centered: PropTypes.bool,
  fixedWidth: PropTypes.bool,
};

export default Whitebox;
