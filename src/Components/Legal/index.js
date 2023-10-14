/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-reactjs';

import Spinner from '../../common/Spinner';
import SEO from '../../common/SEO';
import useCurrentScope from '../../hooks/useCurrentScope';

import { ContentWrapper, Header, PrismicRichText } from '../../UI-Components';

const Legal = () => {
  const { t, ready } = useTranslation();
  const [content, setContent] = useState({});
  const { locale } = useCurrentScope();

  useEffect(() => {
    const fetchData = async () => {
      const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
      const response = await Client.query(Prismic.Predicates.at('document.type', 'terms'), {
        lang: locale.toLowerCase(),
      });
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
      <Header level={1} centered color={'primary'}>
        {t('reusable:title.legal')}
      </Header>
      <PrismicRichText>{RichText.render(content)}</PrismicRichText>
    </ContentWrapper>
  );
};

export default Legal;
