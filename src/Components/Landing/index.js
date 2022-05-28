import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import Spinner from '../../common/Spinner';
import SEO from '../../common/SEO';
import Responsive from '../../common/Responsive';

import DesktopHero from './src/desktopHero';
import MobileHero from './src/mobileHero';
import Reviews from './src/reviews';

const Landing = () => {
  const [ctaVisible, setCtaVisible] = useState(true);
  const mobileText = useRef(null);
  const [unitHeight, setUnitHeight] = useState('0px');

  const { t, ready } = useTranslation('Landing');

  const scrollDown = () => {
    window.scrollTo({ top: mobileText.current.getBoundingClientRect().top - 60, behavior: 'smooth' });
  };

  const onScroll = () => {
    window.scrollY > 0 ? setCtaVisible(false) : setCtaVisible(true);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    setUnitHeight(document.documentElement.style.getPropertyValue('--vh'));
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!ready) return <Spinner page />;

  return (
    <>
      <SEO page='landing' />
      <Responsive displayIn={['mobile']}>
        <MobileHero
          t={t}
          unitHeight={unitHeight}
          ctaVisible={ctaVisible}
          textRef={mobileText}
          scrollDown={() => scrollDown()}
        />
      </Responsive>

      <Responsive displayIn={['tablet', 'laptop', 'desktop']}>
        <DesktopHero t={t} />
      </Responsive>
      <Reviews t={t}/>
    </>
  );
};

export default Landing;
