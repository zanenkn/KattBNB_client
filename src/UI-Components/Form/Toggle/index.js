import React from 'react';
import { Wrapper, Label, Input } from './styles';
import PropTypes from 'prop-types';
import { theme } from '../../../Styles/theme';

const { colors } = theme;

const Toggle = ({ checked, color, onClick, ...rest }) => {
  return (
    <Wrapper {...rest}>
      <Input id='checkbox' type='checkbox' checked={checked} color={color} onChange={onClick} />
      <Label htmlFor='checkbox' />
    </Wrapper>
  );
};

export default Toggle;

Toggle.defaultProps = {
  color: 'success',
};

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  color: PropTypes.oneOf(Object.keys(colors)),
  onClick: PropTypes.func.isRequired,
};
