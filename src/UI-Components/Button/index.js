import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import PropTypes from 'prop-types';
import Refresh from '../../Components/Icons/Refresh'

const { colors, spacing } = theme;

const Styled = styled.button`
  color: ${({ color, loading }) => loading ? colors[color][100] : '#fff'};
  background-color: ${({ color }) => colors[color][100]};
  border: none;
  border-radius: 3px;
  padding: 0 2rem;
  cursor: pointer;
  display: ${({ centered }) => centered ? 'block' : 'inline-block'};
  margin: auto;
  font-weight: 700;
  margin-bottom: ${({ space }) => spacing[space]};
  height: 39px;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${({ color, loading }) => !loading && colors[color][110]};
  }
`;

const Flex = styled.div`
  display: flex;
  position: relative;
`

const Icon = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -10px;
  top: 9px;
  cursor: pointer;

`

const Button = ({ loading, color, centered, space, ...rest }) => {
  return (
    <Flex>
      {loading && <Icon><Refresh height='21' fill='#FAFAFA' className='spin-it' /></Icon>}
    <Styled
      loading={loading}
      color={color}
      centered={centered}
      space={space}
      {...rest}
    />

    </Flex>
  );
};

Button.defaultProps = {
  loading: false,
  color: 'primary',
  centered: true,
  space: 4,
};

Button.propTypes = {
  loading: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(colors)),
  centered: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Button;