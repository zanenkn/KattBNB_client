import React, { useEffect, useState } from 'react'
import { ContentWrapper } from '../../styles/common'
import { FeaturedImage, AuthorAvatar, Flex } from './styles'
import { RichText } from 'prismic-reactjs';
import Prismic from 'prismic-javascript';
import Spinner from '../ReusableComponents/Spinner'

const BlogPost = (props) => {
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (props.location.state) {
      let { title, featured_image, text, date, author_image, author_name } = props.location.state.post.data
      setPost((old) => ({ ...old, title, featured_image, text, date, author_image, author_name }))

    } else {
      const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO);
      Client.getByUID('post', window.location.pathname.split('/blog/')[1]).then((response) => {
        let { title, featured_image, text, date, author_image, author_name } = response.data
        setPost((old) => ({ ...old, title, featured_image, text, date, author_image, author_name }))
      })
    }
  }, []);

  if (!post) {
    return <Spinner />
  }

  return (
    <ContentWrapper>
      <FeaturedImage src={post.featured_image.url} />
      <h1>{post.title[0].text}</h1>

      <Flex>
        <AuthorAvatar src={post.author_image.url} />
        <p>{post.author_name[0].text} | <i>{post.date}</i></p>
      </Flex>

      {RichText.render(post.text)}
    </ContentWrapper>
  )
}

export default BlogPost