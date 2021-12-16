import React, { useEffect, useState } from 'react';
import Prismic from '@prismicio/client';
import { useTranslation } from 'react-i18next';
import Spinner from '../../../common/Spinner';
import { Link } from 'react-router-dom';
import { PostWrapper, PostImage } from '../styles';
import { Container, ContentWrapper, Header, Text } from '../../../UI-Components';
import Navigation from './navigation';

const BlogListing = ({ match }) => {
  const fetchData = async () => {
    const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
    const response = await Client.query(Prismic.Predicates.at('document.type', 'post'), {
      orderings: '[my.post.date desc]',
      pageSize: 5,
      page: match.params.page,
    });
    setPosts(response.results);
    setTotalPages(response.total_pages);
  };

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      window.alertwindow.alert(t('reusable:errors:500'));
    }
    // eslint-disable-next-line
  }, [match.params.page]);

  if (!posts) {
    return <Spinner />;
  }
  return (
    <ContentWrapper>
      {posts.map((post) => {
        return (
          <Link
            key={post.uid}
            to={{
              pathname: `/blog/${post.uid}`,
              state: { post: post },
            }}
          >
            <PostWrapper space={8}>
              <PostImage className='post-image' src={post.data.featured_image.url} alt='' />
              <Container>
                <Header level={3} space={2}>
                  {post.data.title[0].text}
                </Header>
                <Text italic>{post.data.date}</Text>
              </Container>
            </PostWrapper>
          </Link>
        );
      })}
      <Navigation currentPage={parseInt(match.params.page)} total={totalPages} />
    </ContentWrapper>
  );
};

export default BlogListing;
