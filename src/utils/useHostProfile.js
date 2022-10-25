import { useEffect, useState } from 'react';
import axios from 'axios';
import { detectLanguage } from '../Modules/detectLanguage';

export const useHostProfile = (hostProfileId) => {
  const lang = detectLanguage();
  const [errors, setErrors] = useState([]);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);

  if (window.navigator.onLine === false) {
    setErrors((prev) => [...prev, 'reusable:errors:window-navigator']);
  }
  useEffect(() => {
    axios
      .get(`/api/v1/host_profiles/${hostProfileId}?locale=${lang}`)
      .then(({ data }) => {
        const transformedResponse = transformResponseToHost(data);
        setHost(transformedResponse);
      })
      .catch(() => {
        setErrors((prev) => [...prev, 'reusable:errors:unknown']);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, errors, host };
};

const transformResponseToHost = (data) => {
  return {
    availability: data.availability,
    description: data.description,
    hostProfileId: data.id,
    maxCats: data.max_cats_accepted,
    rate: data.price_per_day_1_cat,
    score: data.score,
    supplement: data.supplement_price_per_cat_per_day,
    userId: data.user.id,
    name: data.user.nickname,
    avatar: data.user.profile_avatar,
    location: data.user.location,
  };
};
