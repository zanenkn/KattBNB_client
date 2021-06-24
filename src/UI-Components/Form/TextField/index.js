import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

const TextField = ({ autoComplete, label, onChange, required, space, type, value, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const input = useRef();

  const handleLabelClick = () => {
    if (!isFocused && !value) {
      setIsFocused(isFocused);
      input.current.focus();
    }
  };

  return (
    <TextFieldWrapper space={space}>
      {label && (
        <Label up={isFocused || value} required={required} onClick={() => handleLabelClick()}>
          {label}
        </Label>
      )}
      <Input
        type={type}
        ref={input}
        value={value}
        onChange={(e) => onChange(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete={autoComplete}
        {...rest}
      />
      {required && !value && <RequiredLabel focused={isFocused} />}
    </TextFieldWrapper>
  );
};

const padV = 16;
const padH = 16;
const labelSize = 14;

const TextFieldWrapper = styled.div`
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

TextField.propTypes = {
  autoComplete: PropTypes.oneOf(['on', 'off']),
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  type: PropTypes.oneOf(['email', 'text', 'password', 'number']),
  value: PropTypes.string.isRequired,
};

TextField.defaultProps = {
  autoComplete: 'on',
  required: false,
  space: 4,
  type: 'text',
};

export default TextField;
