/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Spinner from '../../common/Spinner';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { detectLanguage } from '../../Modules/detectLanguage';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-reactjs';
import { ContentWrapper, Header } from '../../UI-Components';
import SEO from '../../common/SEO';

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

  if (!ready) return <Spinner page />;

  return (
    <ContentWrapper>
      <SEO page='legal' />
      <Header level={1} centered>
        {t('reusable:title.legal')}
      </Header>
      {RichText.render(content)}
    </ContentWrapper>
  );
};

export default Legal;
