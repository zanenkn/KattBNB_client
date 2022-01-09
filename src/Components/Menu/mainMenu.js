import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Header } from '../../UI-Components';
import { MenuLink } from './styles';

const MainMenu = ({ closeMenu, activePath }) => {
  const { t } = useTranslation();

  return (
    <>
      <Header level={3} color={activePath === '/search' ? 'primary' : 'neutral'}>
        <Link as={MenuLink} id='search' to='/search' onClick={() => closeMenu()}>
          {t('reusable:navigation.search')}
        </Link>
      </Header>
      <Header level={3} color={activePath === '/about-us' ? 'primary' : 'neutral'}>
        <Link as={MenuLink} id='about' to='/about-us' onClick={() => closeMenu()}>
          {t('reusable:navigation.about-kattbnb')}
        </Link>
      </Header>
      <Header level={3} color={activePath.includes('/blog') ? 'primary' : 'neutral'}>
        <Link as={MenuLink} id='blog' to='/blog/all/1' onClick={() => closeMenu()}>
          {t('reusable:navigation.blog')}
        </Link>
      </Header>
      <Header level={3} color={activePath === '/contact-us' ? 'primary' : 'neutral'}>
        <Link as={MenuLink} id='contact' to='/contact-us' onClick={() => closeMenu()}>
          {t('reusable:navigation.contact')}
        </Link>
      </Header>
      <Header level={3} color={activePath === '/faq' ? 'primary' : 'neutral'}>
        <Link as={MenuLink} id='faq' to='/faq' onClick={() => closeMenu()}>
          {t('reusable:navigation.faq')}
        </Link>
      </Header>
    </>
  );
};

export default MainMenu;
