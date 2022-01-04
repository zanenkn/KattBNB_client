import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../../Styles/theme';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DayPickerWrapper, Label, RequiredLabel } from './styles';
// needs more work
const { spacing } = theme;

const DayPicker = ({
  label,
  onChange,
  required,
  space,
  value,
  format,
  formatDate,
  parseDate,
  inputProps,
  dayPickerProps,
  dayPickerRef,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const input = useRef();

  const handleLabelClick = () => {
    if (!isFocused && !value) {
      setIsFocused(isFocused);
      input.current.children[0].children[0].focus();
    }
  };

  return (
    <DayPickerWrapper space={space}>
      {label && (
        <Label up={isFocused || value} required={required} onClick={() => handleLabelClick()}>
          {label}
        </Label>
      )}
      <div onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} ref={input}>
        <DayPickerInput
          ref={dayPickerRef}
          value={value}
          format={format}
          formatDate={formatDate}
          parseDate={parseDate}
          inputProps={inputProps}
          dayPickerProps={dayPickerProps}
          onDayChange={() => onChange()}
          {...rest}
        />
      </div>
      {required && !value && <RequiredLabel focused={isFocused} />}
    </DayPickerWrapper>
  );
};

DayPicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  type: PropTypes.oneOf(['email', 'text', 'password', 'number']),
  value: PropTypes.string.isRequired,
};

DayPicker.defaultProps = {
  autoComplete: 'on',
  required: false,
  space: 4,
  type: 'text',
};

export default DayPicker;
