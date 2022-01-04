import { useState, useRef, useEffect } from 'react';
import {
  DropdownContainer,
  InputIcon,
  Input,
  DropdownOption,
  DropdownOptionButton,
  Wrapper,
  CloseOnOutsideElementClickEnabler,
  Label,
} from './styles';
import { Chevron } from '../../icons';
import { theme } from '../../../Styles/theme';
// TODO: placeholder/input, required prop, proptypes, default props. default value?

const { colors } = theme;

const AutocompleteDropdown = ({ data, onChange, space, label, id, defaultValue }) => {
  const [search, setSearch] = useState({
    text: '',
    suggestions: data,
  });

  const [suggestionsDisplayed, setSuggestionsDisplayed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const input = useRef();


  useEffect(() => {
    if(defaultValue && search.text === '') {
      suggestionSelected({name: defaultValue})
    }
  }, [])

  const onTextChanged = (e) => {
    const value = e.target.value;
    let suggestions = data;
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = data.sort().filter((v) => regex.test(v.name));
    }
    setSuggestionsDisplayed(true);
    setSearch({ suggestions, text: value });
    onChange('');
  };

  const suggestionSelected = (value) => {
    setSuggestionsDisplayed(false);

    setSearch({
      text: value.name,
      suggestions: [],
    });
    setIsFocused(true);
    onChange(value.name);
  };

  const onInputFocus = () => {
    setSuggestionsDisplayed(true);
    setSearch({ suggestions: data, text: '' });

    setIsFocused(true);
    input.current.focus();
  };

  const onInputBlur = () => {
    setSearch((old) => ({ ...old, text: '' }));
    setIsFocused(false);
    onChange('')
  };

  const { suggestions } = search;

  return (
    <Wrapper space={space || 4}>
      <CloseOnOutsideElementClickEnabler isOn={suggestionsDisplayed} onClick={() => setSuggestionsDisplayed(false)} />

      {label && (
        <Label up={isFocused} required={true} onClick={() => onInputFocus()}>
          {label}
        </Label>
      )}
      <div style={{width: '100%'}} data-cy={`${id}-dropdown`}>
        <Input
          ref={input}
          autoComplete='off'
          value={search.text}
          onChange={onTextChanged}
          onFocus={() => onInputFocus()}
          onBlur={() => setIsFocused(false)}
          onBlur={() => onInputBlur()}
          type={'text'}
        />
        <InputIcon isOpen={suggestionsDisplayed}>
          <Chevron fill={colors.neutral[60]} />
        </InputIcon>
      </div>
      {suggestions.length > 0 && suggestionsDisplayed && (
        <DropdownContainer>
          {suggestions.map((item) => (
            <DropdownOption key={item.code} data-cy={`${id}-option-${item.name}`}>
              <DropdownOptionButton key={item.code} onClick={() => suggestionSelected(item)}>
                {item.name}
              </DropdownOptionButton>
            </DropdownOption>
          ))}
        </DropdownContainer>
      )}
    </Wrapper>
  );
};

export default AutocompleteDropdown;
