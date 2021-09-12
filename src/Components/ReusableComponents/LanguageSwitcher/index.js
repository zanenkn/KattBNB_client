import React, { useState } from 'react';
import i18n from '../../../i18n';
import { Globe, Checkmark } from '../../Icons';
import { MainLabel, Options, Option } from './styles';
import { Text } from '../../../UI-Components';
import PropTypes from 'prop-types';

const LanguageSwitcher = ({ openByDefault, color, label }) => {
  const [showOptions, setShowOptions] = useState(false);
  const dynamicLabel = i18n.language === 'sv' ? 'Svenska' : 'English';

  const changeLng = (lng) => {
    setShowOptions(false);
    i18n.changeLanguage(lng);
    window.localStorage.setItem('I18N_LANGUAGE', lng);
  };

  return (
    <>
      <MainLabel isLink={!openByDefault} onClick={() => setShowOptions(!showOptions)}>
        <Globe fill={color} />
        <Text color={color}>{label || dynamicLabel}</Text>
      </MainLabel>
      <Options show={openByDefault ? true : showOptions}>
        <Option check={i18n.language === 'sv'}>
          <Checkmark fill={color} />
          <Text color={color} onClick={() => changeLng('sv')}>
            Svenska
          </Text>
        </Option>
        <Option check={i18n.language === 'en'}>
          <Checkmark fill={color} />
          <Text color={color} onClick={() => changeLng('en')}>
            English
          </Text>
        </Option>
      </Options>
    </>
  );
};

LanguageSwitcher.defaultProps = {
  openByDefault: false,
  color: 'neutral',
};

LanguageSwitcher.propTypes = {
  openByDefault: PropTypes.bool,
  color: PropTypes.oneOf(['neutral', 'white']),
  label: PropTypes.string,
};

export default LanguageSwitcher;
