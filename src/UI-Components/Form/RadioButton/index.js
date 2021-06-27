import React from 'react';
import { Indicator, Label, Input, LabelText } from './styles';
import PropTypes from 'prop-types';

const RadioButton = ({ checked, disabled, label, onChange, value, ...rest }) => {
  return (
    <Label disabled={disabled}>
      <LabelText checked={checked === value}>{label}</LabelText>
      <Input
        type='radio'
        role='radio'
        checked={checked === value}
        disabled={disabled}
        onChange={onChange}
        value={value}
        {...rest}
      />
      <Indicator />
    </Label>
  );
};

export default RadioButton;

RadioButton.defaultProps = {
  disabled: false,
};

RadioButton.propTypes = {
  checked: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};
