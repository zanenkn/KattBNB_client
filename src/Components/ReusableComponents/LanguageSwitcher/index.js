import React, { useState } from 'react';
import i18n from '../../../i18n';
import { Globe, Checkmark } from '../../Icons';
import { MainLabel, Options, Option } from './styles';
import { Text } from '../../../UI-Components';

const LanguageSwitcher = () => {
  const [showOptions, setShowOptions] = useState(false);

  const changeLng = (lng) => {
    setShowOptions(false);
    i18n.changeLanguage(lng);
    window.localStorage.setItem('I18N_LANGUAGE', lng);
  };

  return (
    <>
      <MainLabel onClick={() => setShowOptions(!showOptions)}>
        <Globe />
        <Text>{i18n.language === 'sv' ? 'Svenska' : 'English'}</Text>
      </MainLabel>
      <Options show={showOptions}>
        <Option check={i18n.language === 'sv'}>
          <Checkmark />
          <Text onClick={() => changeLng('sv')}>Svenska</Text>
        </Option>
        <Option check={i18n.language === 'en'}>
          <Checkmark />
          <Text onClick={() => changeLng('en')}>English</Text>
        </Option>
      </Options>
    </>
  );
};

export default LanguageSwitcher;
