import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';
import DayPickerInput from 'react-day-picker/DayPickerInput';
// TODO> clean up this fucking mess

const { colors, spacing } = theme;

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
      input.current.children[0].children[0].focus()
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

const padV = 16;
const padH = 16;
const labelSize = 14;

const DayPickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${colors.neutral[100]};
  margin-bottom: ${({ space }) => spacing[space]};
  position: relative;
`;

const Label = styled.label`
  color: ${colors.neutral[60]};
  font-size: ${labelSize}px;
  font-style: italic;
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.06, 0.67, 0.32, 0.82);
  transform: translate(${padH}px, ${1.333 * labelSize + padV}px);
  ${({ up, required }) =>
    up &&
    css`
      color: ${colors.neutral[100]};
      transform: scale(1) translate(-2px, -2px);
      font-weight: 700;
      font-style: normal;
      ${required &&
      `::after { 
          content: " *";
          color: ${colors.primary[100]}
        }`}
    `}
`;

const Input = styled.input`
  background-color: transparent;
  box-sizing: border-box;
  color: inherit;
  outline: none;
  border-radius: 3px;
  font-size: 16px;
  width: 100%;
  padding: ${padV}px ${padH}px;
  border: 1px solid ${colors.neutral[60]};
  &:focus {
    border: 1px solid ${colors.neutral[100]};
  }
  &:-internal-autofill-selected {
    background-color: transparent;
  }
`;

const RequiredLabel = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: 20px;
  right: 10px;
  border-radius: 9999px;
  background-color: ${colors.primary[100]};
  opacity: 1;
  transition: all 0.5s ease;
  ${({ focused }) =>
    focused &&
    css`
      opacity: 0;
    `}
`;

DayPicker.propTypes = {
  autoComplete: PropTypes.oneOf(['on', 'off']),
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