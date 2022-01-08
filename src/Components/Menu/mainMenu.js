import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { MenuLink } from './styles';
import LanguageSwitcher from '../../common/LanguageSwitcher';

const MainMenu = ({ closeMenu }) => {
  const { t } = useTranslation();

  return (
    <>
      <Link as={MenuLink} id='search' to='/search' onClick={() => closeMenu()}>
        {t('reusable:navigation.search')}
      </Link>
      <Link as={MenuLink} id='about' to='/about-us' onClick={() => closeMenu()}>
        {t('reusable:navigation.about-kattbnb')}
      </Link>
      <Link as={MenuLink} id='blog' to='/blog/all/1' onClick={() => closeMenu()}>
        {t('reusable:navigation.blog')}
      </Link>
      <Link as={MenuLink} id='contact' to='/contact-us' onClick={() => closeMenu()}>
        {t('reusable:navigation.contact')}
      </Link>
      <Link as={MenuLink} id='faq' to='/faq' onClick={() => closeMenu()}>
        {t('reusable:navigation.faq')}
      </Link>

      <div style={{ minHeight: '200px' }}>
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default MainMenu;
