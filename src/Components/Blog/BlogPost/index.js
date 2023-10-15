import React, { useEffect, useState } from 'react';
import { RichText } from 'prismic-reactjs';
import Prismic from '@prismicio/client';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import withFooter from '../../../HOC/withFooter';
import Share from '../../../common/Share';
import Spinner from '../../../common/Spinner';
import { FeaturedImage, FlexWrapper, AuthorAvatar } from '../styles';
import { Header, Text, ContentWrapper, PrismicRichText, Divider } from '../../../UI-Components';

const BlogPost = ({ location: { state } }) => {
  const [post, setPost] = useState(null);
  const uid = window.location.pathname.split('/blog/')[1];
  const { t } = useTranslation();

  const postSetter = ({
    title,
    featured_image,
    text,
    date,
    author_image,
    author_name,
    seo_title,
    seo_image,
    seo_description,
  }) => {
    setPost((old) => ({
      ...old,
      title,
      featured_image,
      text,
      date,
      author_image,
      author_name,
      seo_title,
      seo_image,
      seo_description,
    }));
  };

  useEffect(() => {
    if (state) {
      postSetter(state.post.data);
    } else {
      const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
      Client.getByUID('post', uid).then((response) => {
        postSetter(response.data);
      });
    }
    // eslint-disable-next-line
  }, []);

  if (!post) {
    return <Spinner page />;
  }

  return (
    <ContentWrapper>
      <Helmet>
        <title>{`${post.seo_title[0].text} | KattBNB`}</title>
        <meta name='description' content={post.seo_description[0].text} />
        <link rel='canonical' href={`https://kattbnb.se/blog/${uid}`} />
        <meta property='og:title' content={`${post.seo_title[0].text} | KattBNB`} />
        <meta property='og:url' content={`https://kattbnb.se/blog/${uid}`} />
        <meta property='og:type' content='website' />
        <meta property='og:description' content={post.seo_description[0].text} />
        <meta property='og:image' content={post.seo_image.url} />
      </Helmet>

      <FeaturedImage src={post.seo_image.url} alt='' />
      <Header space={2}>{post.title[0].text}</Header>
      <FlexWrapper space={10}>
        <AuthorAvatar src={post.author_image.url} alt='' />
        <Text>
          {post.author_name[0].text} | <i>{post.date}</i>
        </Text>
      </FlexWrapper>
      <PrismicRichText space={8}>{RichText.render(post.text)}</PrismicRichText>
      <Divider bottom={5} />
      <Share link={`https://kattbnb.se/blog/${uid}`} title={t('reusable:cta.share-post')} />
    </ContentWrapper>
  );
};

export default withFooter(BlogPost);
