import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import PropTypes from 'prop-types';
import Refresh from '../../Components/Icons/Refresh';

const { colors, spacing } = theme;

const Styled = styled.button`
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  color: ${({ color, $loading }) => ($loading ? colors[color][100] : '#fff')};
  background-color: ${({ color }) => colors[color][100]};
  border: none;
  border-radius: 3px;
  padding: 0 2rem;
  cursor: ${({ disabled, $loading }) => (!$loading && !disabled ? 'pointer' : 'not-allowed')};
  display: ${({ centered }) => (centered ? 'block' : 'inline-block')};
  margin: auto;
  font-weight: 700;
  margin-bottom: ${({ space }) => spacing[space]};
  height: 39px;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${({ color, disabled, $loading }) => !$loading && !disabled && colors[color][110]};
  }
`;

const Flex = styled.div`
  display: flex;
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  z-index: 1;
  left: 50%;
  margin-left: -10px;
  top: 9px;
  cursor: pointer;
`;

const Button = ({ centered, color, disabled, loading, space, ...rest }) => {
  return (
    <Flex>
      {loading && (
        <Icon>
          <Refresh height='21' fill='#FAFAFA' className='spin-it' />
        </Icon>
      )}
      <Styled centered={centered} color={color} disabled={disabled} $loading={loading} space={space} {...rest} />
    </Flex>
  );
};

Button.defaultProps = {
  centered: true,
  color: 'primary',
  disabled: false,
  loading: false,
  space: 4,
};

Button.propTypes = {
  centered: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(colors)),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Button;
