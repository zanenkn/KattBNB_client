import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { theme } from '../../../Styles/theme';

const { colors, spacing } = theme;

const TextField = ({ label, onChange, space, type, value, ...rest }) => {
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
        <Label up={isFocused || value} onClick={() => handleLabelClick()}>
          {label}
        </Label>
      )}
      <Input
        ref={input}
        value={value}
        onChange={(e) => onChange(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
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
  color: ${colors.base};
  margin-bottom: ${({ space }) => spacing[space]};
`;

const Label = styled.label`
  color: ${colors.baseLighter};
  font-size: ${labelSize}px;
  font-style: italic;
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.06, 0.67, 0.32, 0.82);
  transform: translate(${padH}px, ${1.333 * labelSize + padV}px);
  ${({ up }) =>
    up &&
    css`
      color: ${colors.base};
      transform: scale(0.9) translate(-2px, -2px);
      font-weight: 700;
      font-style: normal;
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
  border: 1px solid ${colors.baseLighter};
  &:focus {
    border: 1px solid ${colors.base};
  }
`;

TextField.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  type: PropTypes.oneOf(['email', 'text', 'password', 'number']),
  value: PropTypes.string.isRequired,
};

TextField.defaultProps = {
  space: 4,
  type: 'text',
};

export default TextField;
