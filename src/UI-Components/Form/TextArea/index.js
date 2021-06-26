import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {TextAreaWrapper, TextBox, Label, RequiredLabel} from './styles'
import { theme } from '../../../Styles/theme';

const { spacing } = theme;

const TextArea = ({ label, onChange, required, space, type, value, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textarea = useRef();

  const handleLabelClick = () => {
    if (!isFocused && !value) {
      setIsFocused(isFocused);
      textarea.current.focus();
    }
  };

  return (
    <TextAreaWrapper space={space}>
      {label && (
        <Label up={isFocused || value} required={required} onClick={() => handleLabelClick()}>
          {label}
        </Label>
      )}
      <TextBox
        type={type}
        ref={textarea}
        value={value}
        onChange={(e) => onChange(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {required && !value && <RequiredLabel focused={isFocused} />}
    </TextAreaWrapper>
  );
};

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  space: PropTypes.oneOf(Object.keys(spacing).map((key) => parseInt(key))),
  type: PropTypes.oneOf(['email', 'text', 'password', 'number']),
  value: PropTypes.string.isRequired,
};

TextArea.defaultProps = {
  required: false,
  space: 4,
  type: 'text',
};

export default TextArea;
