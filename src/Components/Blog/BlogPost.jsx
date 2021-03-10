import React from 'react'

const BlogPost = (props) => {
  return (
    <div>{props.location.state.post.data.title[0].text}</div>
  )
}

export default BlogPost