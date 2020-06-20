import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Message, Header, Image, Divider } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import { detectLanguage } from '../../Modules/detectLanguage'
import { wipeCredentials } from '../../Modules/wipeCredentials'
import axios from 'axios'
import ReviewScore from '../ReusableComponents/ReviewScore'
import moment from 'moment'

const AllReviews = (props) => {

  const { t, ready } = useTranslation('AllReviews')

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [errorDisplay, setErrorDisplay] = useState(false)
  const lang = detectLanguage()

  useEffect(() => {
    setLoading(true)
    if (window.navigator.onLine === false) {
      setLoading(false)
      setErrors(['reusable:errors:window-navigator'])
      setErrorDisplay(true)
    } else {
      axios.get(`/api/v1/reviews?host_profile_id=${props.hostProfileId}&locale=${lang}`)
        .then(resp => {
          let sortedReviews = resp.data
          sortedReviews.sort((a, b) => ((new Date(b.created_at)).getTime() - (new Date(a.created_at)).getTime()))
          setReviews(sortedReviews)
          setLoading(false)
        })
        .catch(error => {
          if (error.response === undefined) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 500) {
            setLoading(false)
            setErrorDisplay(true)
            setErrors(['reusable:errors:500'])
          } else if (error.response.status === 503) {
            wipeCredentials('/is-not-available?atm')
          } else if (error.response.status === 401) {
            window.alert(t('reusable:errors:401'))
            wipeCredentials('/')
          } else {
            setLoading(false)
            setErrorDisplay(true)
            setErrors([error.response.data.error])
          }
        })
    }
  }, [])

  if (ready && loading === false) {
    moment.locale(lang)
    return (
      <>
        {
          errorDisplay &&
          <Message negative >
            <ul id='message-error-list'>
              {errors.map(error => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        }
        {
          props.score === null && reviews.length === 0 ?
            <p style={{ 'color': 'silver', 'fontStyle': 'italic' }}>{t('AllReviews:no-reviews')}</p>
            : props.score !== null && reviews.length === 0 ?
              <p style={{ 'color': 'silver', 'fontStyle': 'italic' }}>{t('reusable:errors:index-no-host-2')}</p>
              :
              <>
                <ReviewScore score={props.score} displayNumerical={true} margin={'0'} />
                <p style={{ 'color': 'silver', 'fontStyle': 'italic', 'marginBottom': '3rem' }}>{t('AllReviews:review-count', { count: reviews.length })}</p>
                <Divider />
                <div id='all-reviews'>
                  {
                    reviews.map((review) => {
                      return (
                        <div key={review.id} id={`review-${review.id}`} style={{ 'margin': '2rem 0 3rem' }}>
                          <div style={{ 'display': 'flex', 'alignItems': 'center' }}>
                            <Image src={review.user === null ? 'https://ui-avatars.com/api/?name=[x]&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false' : review.user.profile_avatar === null ? `https://ui-avatars.com/api/?name=${review.user.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false` : review.user.profile_avatar} size='small' style={{ 'borderRadius': '50%', 'width': '3rem', 'height': '3rem' }}></Image>
                            <div style={{ 'display': 'flex', 'alignItems': 'baseline' }}>
                              <Header style={{ 'margin': '0 0.5rem' }}>
                                {review.user === null ? t('reusable:deleted-user') : review.user.nickname}
                              </Header>
                              <p style={{ 'fontSize': 'small' }}>
                                {moment(review.created_at).fromNow()}
                              </p>
                            </div>
                          </div>
                          <ReviewScore score={review.score} displayNumerical={true} height='1rem' />
                          <p>{review.body}</p>
                          {
                            review.host_reply === null && review.host_nickname === props.username &&
                            <p className='fake-link-underlined'>{t('AllReviews:host-reply')}</p>
                          }
                          <Divider />
                        </div>
                      )
                    })
                  }
                </div>
              </>
        }
      </>
    )
  } else {
    return (<Spinner />)
  }
}

const mapStateToProps = state => ({
  username: state.reduxTokenAuth.currentUser.attributes.username
})

export default connect(mapStateToProps)(AllReviews)
