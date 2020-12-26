/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Header } from 'semantic-ui-react';
import Spinner from '../ReusableComponents/Spinner';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { detectLanguage } from '../../Modules/detectLanguage';
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';

const Legal = () => {
  const { t, ready } = useTranslation();
  const [content, setContent] = useState({});
  const locale = detectLanguage().toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
      const response = await Client.query(Prismic.Predicates.at('document.type', 'terms'), { lang: locale });
      setContent(response.results[0].data.body);
    };
    try {
      fetchData();
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }
  }, [locale]);

  if (ready) {
    return (
      <>
        <Helmet>
          <title>KattBNB - användarvillkor</title>
          <meta
            name='description'
            content='Tack för att du väljer KattBNB. Vi vill att du känner dig trygg med att använda vår webbapp. Här är reglerna som gäller.'
          />
          <link rel='canonical' href='https://kattbnb.se/legal' />
          <meta property='og:title' content='KattBNB - användarvillkor' />
          <meta property='og:url' content='https://kattbnb.se/legal' />
          <meta property='og:type' content='website' />
          <meta
            property='og:description'
            content='Tack för att du väljer KattBNB. Vi vill att du känner dig trygg med att använda vår webbapp. Här är reglerna som gäller.'
          />
          <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
        </Helmet>
        <div className='content-wrapper' style={{ marginBottom: '2rem', paddingBottom: '0' }}>
          <Header as='h1'>{t('reusable:title.legal')}</Header>
        </div>
        <div className='expanding-wrapper' id='terms'>
          {RichText.render(content)}
        </div>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default Legal;
