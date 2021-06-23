import { useState } from 'react';
import {
  DropdownContainer,
  InputIcon,
  Input,
  DropdownOption,
  DropdownOptionButton,
  Wrapper,
  CloseOnOutsideElementClickEnabler,
} from './styles';
import { Chevron } from '../../icons';
import { theme } from '../../../Styles/theme';
// TODO: placeholder/input, required prop, proptypes, default props

const { colors } = theme;

const AutocompleteDropdown = ({ data, onChange, space }) => {
  const [search, setSearch] = useState({
    text: '',
    suggestions: data,
  });

  const [suggestionsDisplayed, setSuggestionsDisplayed] = useState(false);

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

    onChange(value.name);
  };

  const onInputFocus = () => {
    setSuggestionsDisplayed(true);
    setSearch({ suggestions: data, text: '' });
  };

  const { suggestions } = search;

  return (
    <Wrapper space={space || 4}>
      <CloseOnOutsideElementClickEnabler isOn={suggestionsDisplayed} onClick={() => setSuggestionsDisplayed(false)} />
      <div>
        <Input
          autoComplete='off'
          value={search.text}
          onChange={onTextChanged}
          onFocus={() => onInputFocus()}
          onBlur={() => setSearch((old) => ({ ...old, text: '' }))}
          type={'text'}
        />
        <InputIcon isOpen={suggestionsDisplayed}>
          <Chevron fill={colors.neutral[60]} />
        </InputIcon>
      </div>
      {suggestions.length > 0 && suggestionsDisplayed && (
        <DropdownContainer>
          {suggestions.map((item) => (
            <DropdownOption key={item.code}>
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
