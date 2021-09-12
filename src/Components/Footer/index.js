import { StyledFooter, FooterInnerWrap, ColumnGrid, BottomFlexbox, SocialWrapper } from './styles';
import { Text, Divider, InlineLink } from '../../UI-Components';
import LanguageSwitcher from '../ReusableComponents/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '../Icons';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <StyledFooter>
      <FooterInnerWrap>
        <ColumnGrid>
          <li>
            <Text bold>KattBNB</Text>
            <ul>
              <li>
                <Text as={Link} to={'/search'}>
                  {t('reusable:navigation.search')}
                </Text>
              </li>
              <li>
                <Text as={Link} to={i18n.language === 'sv' ? '/bli-kattvakt' : '/become-host'}>
                  {t('reusable:navigation.become-sitter')}
                </Text>
              </li>
              <li>
                <Text as={Link} to={'/area-list'}>
                  {t('reusable:navigation.sitters-near-you')}
                </Text>
              </li>
            </ul>
          </li>
          <li>
            <Text bold>{t('reusable:navigation.about')}</Text>
            <ul>
              <li>
                <Text as={Link} to='/about-us'>
                  {t('reusable:navigation.about-kattbnb')}
                </Text>
              </li>
              <li>
                <Text as={Link} to='/blog/all/1'>
                  {t('reusable:navigation.blog')}
                </Text>
              </li>
              <li>
                <Text as={Link} to='/legal'>
                  {t('reusable:navigation.terms')}
                </Text>
              </li>
              <li>
                <Text as={Link} to='/partners'>
                  {t('reusable:navigation.partners')}
                </Text>
              </li>
            </ul>
          </li>
          <li>
            <Text bold>{t('reusable:navigation.support')}</Text>
            <ul>
              <li>
                <Text as={Link} to='/faq'>
                  {t('reusable:navigation.faq')}
                </Text>
              </li>
              <li>
                <Text as={Link} to='/guidelines'>
                  {t('reusable:navigation.tips')}
                </Text>
              </li>
              <li>
                <Text as={Link} to='/contact-us'>
                  {t('reusable:navigation.contact')}
                </Text>
              </li>
            </ul>
          </li>
          <li>
            <LanguageSwitcher openByDefault color='white' label={t('reusable:navigation.language')} />
          </li>
        </ColumnGrid>

        <Divider color='white' />
        <BottomFlexbox>
          <Text space={0} size='xs' color='white'>
            © {new Date().getFullYear()} KattBNB AB | Reg.nr. 559252-4481
          </Text>
          <SocialWrapper>
            <a href='https://www.facebook.com/kattbnb/' target='_blank' rel='noopener noreferrer'>
              <FacebookIcon fill='white' height={6} />
            </a>
            <a href='https://www.instagram.com/kattbnb' target='_blank' rel='noopener noreferrer'>
              <InstagramIcon fill='white' height={6} />
            </a>
            <a href='https://www.linkedin.com/company/kattbnb' target='_blank' rel='noopener noreferrer'>
              <LinkedinIcon fill='white' height={6} />
            </a>
          </SocialWrapper>
        </BottomFlexbox>
      </FooterInnerWrap>
    </StyledFooter>
  );
};

export default Footer;
