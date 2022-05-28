import styled from 'styled-components';
import { theme } from '../../Styles/theme';
import PropTypes from 'prop-types';
import { Refresh } from '../../icons';

const { colors, spacing, fontSize } = theme;

const Styled = styled.button`
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  color: ${({ $loading }) => ($loading ? 'transparent' : '#fff')};
  background-color: ${({ color, secondary }) => colors[color][secondary ? 40 : 100]};
  border: none;
  border-radius: 3px;
  padding: 0 1.25rem;
  cursor: ${({ disabled, $loading }) => (!$loading && !disabled ? 'pointer' : 'not-allowed')};
  display: ${({ centered }) => (centered ? 'block' : 'inline-block')};
  margin: auto;
  font-weight: 700;
  height: 39px;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${({ color, disabled, $loading, secondary }) =>
      !$loading && !disabled && colors[color][secondary ? 60 : 110]};
  }
`;

const Flex = styled.div`
  display: flex;
  position: relative;
  margin-bottom: ${({ space }) => spacing[space]};
  > a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: ${fontSize['sm']};
    text-align: center;
    width: ${({fixedWidth}) => fixedWidth ?? 'auto'}
  }
`;

const Icon = styled.div`
  position: absolute;
  z-index: 1;
  left: 50%;
  margin-left: -10px;
  top: 9px;
  cursor: pointer;
`;

const Button = ({ centered, color, disabled, fixedWidth, loading, secondary, space, ...rest }) => {
  return (
    <Flex space={space} fixedWidth={fixedWidth}>
      {loading && (
        <Icon>
          <div className='spin-it'>
            <Refresh height={5} fill='neutral' tint={10} />
          </div>
        </Icon>
      )}
      <Styled
        centered={centered}
        color={color}
        disabled={disabled}
        $loading={loading}
        secondary={secondary}
        {...rest}
      />
    </Flex>
  );
};

Button.defaultProps = {
  centered: true,
  color: 'primary',
  disabled: false,
  loading: false,
  secondary: false,
  space: 4,
};

Button.propTypes = {
  centered: PropTypes.bool,
  color: PropTypes.oneOf(Object.keys(colors)),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  secondary: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
};

export default Button;
