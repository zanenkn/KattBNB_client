import { useState, useEffect } from 'react';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';

import { Header, Divider, Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import FacebookSimple from '../Icons/FacebookSimple';
import TwitterSimple from '../Icons/TwitterSimple';
import LinkedinSimple from '../Icons/LinkedinSimple';
import Charity from './charity';
import { detectLanguage } from '../../Modules/detectLanguage';
import Spinner from '../ReusableComponents/Spinner';
import i18n from '../../i18n';

const PawsOfPeace = ({ location }) => {
  const { t, ready } = useTranslation('PawsOfPeace');

  const locale = detectLanguage().toLowerCase();

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const fetchData = async (language) => {
    const Client = Prismic.client(process.env.REACT_APP_PAWS_PRISMIC_REPO);

    const response = await Client.query([Prismic.Predicates.at('document.type', 'charity')], { lang: language });
    const types = await Client.query([Prismic.Predicates.at('document.type', 'donation-type')], { lang: language });
    const descr = await Client.query([Prismic.Predicates.at('document.type', 'description')], { lang: language });
    setCharities(response.results);
    setTypes(types.results);
    setDescription(descr.results[0]?.data?.description);
  };

  const getLoc = (param) => {
    return param === 'sv' ? 'sv-se' : 'en-us';
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paramLang = urlParams.get('lang');

    if (location.search) {
      debugger
      if (paramLang) {
        i18n.changeLanguage(paramLang);
        paramLang && window.localStorage.setItem('I18N_LANGUAGE', paramLang);
      }
    }

    const loc = paramLang ? getLoc(paramLang) : locale;

    try {
      fetchData(loc);
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }
  }, [locale]);

  const [activeIndex, setActiveIndex] = useState();
  const [charities, setCharities] = useState([]);
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState([]);

  if (!ready) return <Spinner />;

  return (
    <>
      <div className='content-wrapper' style={{ marginBottom: '2rem', paddingBottom: '0' }}>
        <Header as='h1'>{t('PawsOfPeace:title')}</Header>
      </div>
      <div className='expanding-wrapper' style={{ paddingTop: '0' }}>
        {RichText.render(description)}

        <a target='_blank' href={'https://www.buymeacoffee.com/TanyaL'}>
          <Button style={{marginBottom: '2rem'}}>{t('PawsOfPeace:support')}</Button>
        </a>
        <p>{t('PawsOfPeace:share')}</p>

        <div className='share-icons' style={{ justifyContent: 'center' }}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://kattbnb.se/paws-of-peace?lang=${locale.split('-')[0]}`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ marginRight: '1rem' }}
          >
            <FacebookSimple height={'1.75rem'} className={'some-icon'} fill={'silver'} />
          </a>
          <a
            href={`https://twitter.com/home?status=https://kattbnb.se/paws-of-peace?lang=${locale.split('-')[0]}`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ marginRight: '1rem' }}
          >
            <TwitterSimple height={'2rem'} className={'some-icon'} fill={'silver'} />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://kattbnb.se/paws-of-peace?lang=${locale.split('-')[0]}&title=&summary=&source=`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <LinkedinSimple height={'2rem'} className={'some-icon'} fill={'silver'} />
          </a>
        </div>

        <Header style={{ marginTop: '4rem' }}>{t('PawsOfPeace:charities')}</Header>

        <Divider style={{ margin: '2rem 0' }} />
        {charities.map((charity, i) => (
          <Charity
            image={charity.data.image.url}
            activeIndex={activeIndex}
            handleClick={handleClick}
            indx={i + 1}
            title={charity.data.name[0].text}
            location={charity.data.location_name[0].text}
            locationLink={charity.data.location_link.url}
            websiteLink={charity.data.website.url}
            description={charity.data.description}
            donationLink={charity.data.donation_link.url}
            donationDescription={
              types.filter((donationType) => donationType.data.type[0].text === charity.data.donation_type)[0]?.data
                .description
            }
            added={charity.data.added}
            verified={charity.data.verified}
            t={t}
            locale={locale}
          />
        ))}
      </div>
    </>
  );
};

export default PawsOfPeace;
