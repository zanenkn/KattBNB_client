import React, { useEffect, useState } from 'react';
import { RichText } from 'prismic-reactjs';
import Prismic from '@prismicio/client';
import Spinner from '../../../common/Spinner';
import { Helmet } from 'react-helmet';
import { FacebookSimple, LinkedinSimple, TwitterSimple } from '../../../icons';
import { useTranslation } from 'react-i18next';
import { FeaturedImage, FlexWrapper, AuthorAvatar, PrismicRichText, ShareIcons } from '../styles';
import { Header, Text, LinkIcon, ContentWrapper } from '../../../UI-Components';

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
    return <Spinner />;
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
      <PrismicRichText>{RichText.render(post.text)}</PrismicRichText>

      <Text bold space={2} color='primary'>
        {t('reusable:share')}:
      </Text>
      <ShareIcons>
        <LinkIcon
          href={`https://www.facebook.com/sharer/sharer.php?u=https://kattbnb.se/blog/${uid}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <FacebookSimple height={5} tint={40} />
        </LinkIcon>
        <LinkIcon
          href={`https://twitter.com/home?status=https://kattbnb.se/blog/${uid}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <TwitterSimple height={6} tint={40} />
        </LinkIcon>
        <LinkIcon
          href={`https://www.linkedin.com/shareArticle?mini=true&url=https://kattbnb.se/blog/${uid}&title=&summary=&source=`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <LinkedinSimple height={6} tint={40} />
        </LinkIcon>
      </ShareIcons>
    </ContentWrapper>
  );
};

export default BlogPost;
