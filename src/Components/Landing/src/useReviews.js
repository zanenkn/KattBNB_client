import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { detectLanguage } from '../../../Modules/detectLanguage';
import { wipeCredentials } from '../../../Modules/wipeCredentials';

const useReviews = () => {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { t } = useTranslation('reusable');
  const lang = detectLanguage();

  useEffect(() => {
    if (window.navigator.onLine === false) {
      setLoading(false);
      setErrors(['reusable:errors:window-navigator']);
      return;
    }
    axios
      .get('/api/v1/random_reviews/reviews', {
        params: {
          locale: lang,
        },
      })
      .then((resp) => {
        setReviews(reviewTransformer(resp.data));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined || error.response.status === 500) {
          setErrors(['reusable:errors.unknown']);
        } else {
          setErrors(error.response.data.errors);
        }
      });
  }, []);
  return { loading, errors, reviews };
};

export default useReviews;

const reviewTransformer = (reviews) => {
  return reviews.map((review) => {
    return {
      id: review.id,
      body: review.body,
      username: review.user.nickname,
      location: review.user.location,
      avatar: review.user.profile_avatar,
      created: review.created_at,
      score: review.score,
    };
  });
};
