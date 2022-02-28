import { useState, useEffect } from 'react';
import Prismic from 'prismic-javascript';

import { Header, Divider } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import FacebookSimple from '../Icons/FacebookSimple';
import TwitterSimple from '../Icons/TwitterSimple';
import LinkedinSimple from '../Icons/LinkedinSimple';
import Charity from './charity';
import { detectLanguage } from '../../Modules/detectLanguage';
import Spinner from '../ReusableComponents/Spinner';

const PawsOfPeace = () => {
  const { t, ready } = useTranslation('PawsOfPeace');

  const locale = detectLanguage().toLowerCase();

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const fetchData = async () => {
    const Client = Prismic.client(process.env.REACT_APP_PAWS_PRISMIC_REPO);

    const response = await Client.query([Prismic.Predicates.at('document.type', 'charity')], { lang: locale });
    const types = await Client.query([Prismic.Predicates.at('document.type', 'donation-type')]);
    setCharities(response.results);
    setTypes(types.results);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }
  }, [locale]);

  const [activeIndex, setActiveIndex] = useState();
  const [charities, setCharities] = useState([]);
  const [types, setTypes] = useState([]);

  if (!ready) return <Spinner />;
  
  return (
    <>
      <div className='content-wrapper' style={{ marginBottom: '2rem', paddingBottom: '0' }}>
        <Header as='h1'>{t('PawsOfPeace:title')}</Header>
      </div>
      <div className='expanding-wrapper' style={{ paddingTop: '0' }}>
        <p dangerouslySetInnerHTML={{ __html: t('PawsOfPeace:description') }}></p>

        <div className='share-icons' style={{ justifyContent: 'center' }}>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://kattbnb.se/paws-of-peace`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ marginRight: '1rem' }}
          >
            <FacebookSimple height={'1.75rem'} className={'some-icon'} fill={'silver'} />
          </a>
          <a
            href={`https://twitter.com/home?status=https://kattbnb.se/paws-of-peace`}
            target='_blank'
            rel='noopener noreferrer'
            style={{ marginRight: '1rem' }}
          >
            <TwitterSimple height={'2rem'} className={'some-icon'} fill={'silver'} />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://kattbnb.se/paws-of-peace&title=&summary=&source=`}
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
