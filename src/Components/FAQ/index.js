/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import Spinner from '../../common/Spinner';
import queryString from 'query-string';
import Prismic from '@prismicio/client';
import { detectLanguage } from '../../Modules/detectLanguage';
import { ContentWrapper, Text, Header, InlineLink, Container } from '../../UI-Components';
import SEO from '../../common/SEO';
import Question from './question';

const Faq = ({ location }) => {
  const useReturnRef = (key) => {
    const ref = useCallback(
      (node) => {
        if (
          node !== null &&
          node.children[0].childElementCount > 1 &&
          queryString.parse(window.location.search).section &&
          queryString.parse(window.location.search).section === key
        ) {
          const nav = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--nav'));
          window.scrollTo({ top: node.getBoundingClientRect().top - nav, behavior: 'smooth' });
        }
      },
      [questions]
    );
    return ref;
  };

  const fetchData = async (tag) => {
    const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);

    const response = await Client.query(
      [Prismic.Predicates.at('document.type', 'faq_item'), Prismic.Predicates.at('document.tags', [tag])],
      { orderings: '[my.faq_item.index]', lang: locale }
    );
    setQuestions((old) => ({ ...old, [tag]: response.results }));
  };

  const onQuestionClick = (index) => {
    setActiveIndex(activeIndex !== index ? index : null)
    window.history.replaceState(null, null, `/faq?active=${index}`);
  }

  const [activeIndex, setActiveIndex] = useState(null);
  const [questions, setQuestions] = useState({
    general: [],
    sitter: [],
    owner: [],
    privacy: [],
    payments: [],
  });

  const locale = detectLanguage().toLowerCase();
  const { t, ready } = useTranslation('Faq');

  const general = useReturnRef('general');
  const sitter = useReturnRef('sitter');
  const owner = useReturnRef('owner');
  const privacy = useReturnRef('privacy');
  const payments = useReturnRef('payments');

  useEffect(() => {
    try {
      fetchData('general');
      fetchData('sitter');
      fetchData('owner');
      fetchData('privacy');
      fetchData('payments');
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }

    let query = queryString.parse(location.search);
    if (query.active) {
      setActiveIndex(parseInt(query.active));
    }
  }, [locale]);

  if (!ready) return <Spinner page/>;

  return (
    <ContentWrapper>
      <SEO page='faq' />
      <Header centered color={'primary'}>
        {t('reusable:title.faq')}
      </Header>
      <Text centered>
        <Trans i18nKey='Faq:to-guidelines'>
          Have you booked a stay already? Check out our helpful
          <InlineLink as={Link} to='guidelines' color='info'>
            guidelines
          </InlineLink>
          .
        </Trans>
      </Text>
      <div ref={general}>
        <Container space={6}>
          <Header level={3}>{t('Faq:general')}</Header>
          {questions.general.map((question) => {
            return (
              <Question
                question={question}
                activeIndex={activeIndex}
                onClick={() => onQuestionClick(question.data.index)}
              />
            );
          })}
        </Container>
      </div>
      <div ref={sitter} space={6}>
        <Container space={6}>
          <Header level={3}>{t('Faq:sitter')}</Header>
          {questions.sitter.map((question) => {
            return (
              <Question
                question={question}
                activeIndex={activeIndex}
                onClick={() => onQuestionClick(question.data.index)}
              />
            );
          })}
        </Container>
      </div>
      <div ref={owner} space={6}>
        <Container space={6}>
          <Header level={3}>{t('Faq:owner')}</Header>
          {questions.owner.map((question) => {
            return (
              <Question
                question={question}
                activeIndex={activeIndex}
                onClick={() => onQuestionClick(question.data.index)}
              />
            );
          })}
        </Container>
      </div>
      <div ref={privacy} space={6}>
        <Container space={6}>
          <Header level={3}>{t('Faq:privacy')}</Header>
          {questions.privacy.map((question) => {
            return (
              <Question
                question={question}
                activeIndex={activeIndex}
                onClick={() => onQuestionClick(question.data.index)}
              />
            );
          })}
        </Container>
      </div>
      <div ref={payments} space={6}>
        <Container space={6}>
          <Header level={3}>{t('Faq:payments')}</Header>
          {questions.payments.map((question) => {
            return (
              <Question
                question={question}
                activeIndex={activeIndex}
                onClick={() => onQuestionClick(question.data.index)}
              />
            );
          })}
        </Container>
      </div>
    </ContentWrapper>
  );
};

export default Faq;
