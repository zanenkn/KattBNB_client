import React, { useEffect, useState } from 'react'
import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import Spinner from '../ReusableComponents/Spinner'
import { Link } from 'react-router-dom';

const BlogListing = () => {
  const fetchData = async () => {
    const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);

    const response = await Client.query(
      Prismic.Predicates.at('document.type', 'post'),
      { orderings: '[my.post.date desc]', pageSize : 10 }
    );
    setPosts(response.results);
  };

  const [posts, setPosts] = useState([])

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.log(error)
      //window.alertwindow.alert(t('reusable:errors:500'));
    }
  }, []);

  if (!posts) {
    return <Spinner />
  }
  return (
    <div>
      {posts.map((post) => {
        return (
          <Link to={{
            pathname: `/blog/${post.uid}`,
            state: { post: post }
          }}>
            <div>
              <img src={post.data.featured_image.url} width={100} />
              {post.data.title[0].text}
            </div>
          </Link>
        )
      })}

    </div>

  )
}

export default BlogListing