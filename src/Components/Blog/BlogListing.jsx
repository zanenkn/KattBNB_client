import React, { useEffect, useState } from 'react';
import Prismic from 'prismic-javascript';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import { Link } from 'react-router-dom';

const BlogListing = () => {
  const fetchData = async () => {
    const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
    const response = await Client.query(Prismic.Predicates.at('document.type', 'post'), {
      orderings: '[my.post.date desc]',
      pageSize: 10,
    });
    setPosts(response.results);
  };

  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }
    // eslint-disable-next-line
  }, []);

  if (!posts) {
    return <Spinner />;
  }
  return (
    <div className='styled-content-wrapper'>
      {posts.map((post) => {
        return (
          <Link
            to={{
              pathname: `/blog/${post.uid}`,
              state: { post: post },
            }}
          >
            <div className='post-wrapper'>
              <img className='post-image' src={post.data.featured_image.url} alt='' />
              <div>
                <h2>{post.data.title[0].text}</h2>
                <p>{post.data.date}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BlogListing;
