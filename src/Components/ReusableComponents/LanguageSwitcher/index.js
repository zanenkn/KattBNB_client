import React, {useState} from 'react';
import i18n from '../../../i18n'
import { Globe } from '../../Icons';
import { StyledFlexbox, MainLabel, Options, Option } from './styles';

const LanguageSwitcher = () => {
  const [showOptions, setShowOptions ] = useState(false)

  const changeLng = (lng) => {
    setShowOptions(false)
    i18n.changeLanguage(lng);
    window.localStorage.setItem('I18N_LANGUAGE', lng);
  };

  return (
    <>
    <StyledFlexbox>
      <Globe />
      <MainLabel onClick={()=> setShowOptions(!showOptions)}>{i18n.language === 'sv' ? 'Svenska' : 'English'}</MainLabel>
    </StyledFlexbox>
    <Options show={showOptions}>
      <Option bold={i18n.language === 'sv'} onClick={() => changeLng('sv')}>Svenska</Option>
      <Option bold={i18n.language === 'en'} onClick={() => changeLng('en')}>English</Option>
    </Options>
    </>
  );
};

export default LanguageSwitcher;
