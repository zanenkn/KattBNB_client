import React, { useEffect, useState } from 'react';
import { RichText } from 'prismic-reactjs';
import Prismic from 'prismic-javascript';
import Spinner from '../ReusableComponents/Spinner';
import { Helmet } from 'react-helmet';
import FacebookSimple from '../Icons/FacebookSimple';
import TwitterSimple from '../Icons/TwitterSimple';
import LinkedinSimple from '../Icons/LinkedinSimple';
import { useTranslation } from 'react-i18next';

const BlogPost = (props) => {
  const [post, setPost] = useState(null);
  const uid = window.location.pathname.split('/blog/')[1];
  const { t } = useTranslation();

  useEffect(() => {
    if (props.location.state) {
      let {
        title,
        featured_image,
        text,
        date,
        author_image,
        author_name,
        seo_title,
        seo_image,
        seo_description,
      } = props.location.state.post.data;
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
    } else {
      const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
      Client.getByUID('post', uid).then((response) => {
        let {
          title,
          featured_image,
          text,
          date,
          author_image,
          author_name,
          seo_title,
          seo_image,
          seo_description,
        } = response.data;
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
      });
    }
    // eslint-disable-next-line
  }, []);

  if (!post) {
    return <Spinner />;
  }

  return (
    <>
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
      <div className='styled-content-wrapper'>
        <img className='featured-image' src={post.featured_image.url} alt='' />
        <h1>{post.title[0].text}</h1>
        <div className='flex'>
          <img className='author-avatar' src={post.author_image.url} alt='' />
          <p>
            {post.author_name[0].text} | <i>{post.date}</i>
          </p>
        </div>
        {RichText.render(post.text)}
        <div className='share-wrapper'>
          <h5>{t('reusable:share')}:</h5>
          <div className='share-icons'>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://kattbnb.se/blog/${uid}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ marginRight: '1rem' }}
            >
              <FacebookSimple height={'1.75rem'} className={'some-icon'} fill={'silver'} />
            </a>
            <a
              href={`https://twitter.com/home?status=https://kattbnb.se/blog/${uid}`}
              target='_blank'
              rel='noopener noreferrer'
              style={{ marginRight: '1rem' }}
            >
              <TwitterSimple height={'2rem'} className={'some-icon'} fill={'silver'} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=https://kattbnb.se/blog/${uid}&title=&summary=&source=`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <LinkedinSimple height={'2rem'} className={'some-icon'} fill={'silver'} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
