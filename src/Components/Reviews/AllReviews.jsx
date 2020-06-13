import React, { useEffect, useState } from 'react'
import { detectLanguage } from '../../Modules/detectLanguage'
import axios from 'axios'



const AllReviews = (props) => {

  const [reviews, setReviews] = useState([])

  useEffect(() => {

    const lang = detectLanguage()
    const path = `/api/v1/reviews?host_profile_id=${props.id}&locale=${lang}`
    axios.get(path)
      .then(resp => {
        setReviews(resp.data)
      })
  }, [props.id])

  return (
    <>
      {
        reviews.length > 0 &&
        <>
          <p>
            {parseFloat(props.score).toFixed(2)}
          </p>
          <p>
            {reviews.length}
          </p>
        </>
      }
      {
        reviews.length === 0 ?
          'no reviews' :
          reviews.map((review) => {
            return (
              <p key={review.id} id={`review-${review.id}`}>
                {review.score}
                {review.body}
                {review.user.nickname}
                {review.user.profile_avatar}
                {review.created_at}
              </p>
            )
          })
      }
    </>
  )
}

export default AllReviews
