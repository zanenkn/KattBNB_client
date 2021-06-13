import styled from 'styled-components';
import { theme } from '../../../Styles/theme';
import PropTypes from 'prop-types';

const Styled = styled.div`
  position: relative;
  background: #ffffff;
  margin: 0 auto ${(props) => theme.spacing[props.space]};
  box-shadow: ${(props) => (props.responsive ? 'none' : '0px 0px 20px -5px rgba(0,0,0,0.2)')};
  border: none;
  padding: ${(props) => (props.responsive ? '0' : `${theme.spacing[5]}`)};
  border-radius: 0;
  border: none;
  max-width: 560px;
  box-sizing: border-box;

  @media screen and (min-width: ${theme.screens.sm}) {
    box-shadow: 0px 0px 20px -5px rgba(0, 0, 0, 0.2);
    padding: ${theme.spacing[6]};
  }

  @media screen and (min-width: ${theme.screens.md}) {
    padding: ${theme.spacing[8]};
  }
`;

const Whitebox = ({ responsive, space, ...rest }) => {
  return <Styled responsive={responsive} space={space} {...rest} />;
};

Whitebox.defaultProps = {
  responsive: true,
  space: 7,
};

Whitebox.propTypes = {
  responsive: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(theme.spacing).map((key) => parseInt(key))),
};

export default Whitebox;
