import React, { useEffect, useState } from 'react';
import { detectLanguage } from '../../../Modules/detectLanguage';
import axios from 'axios';
import { useDispatch } from 'react-redux'

export const useFetchHost = (id) => {
  const lang = detectLanguage();
  const [errors, setErrors] = useState([]);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()

  if (window.navigator.onLine === false) {
    setErrors((prev) => [...prev, 'reusable:errors:window-navigator']);
  }
  useEffect(() => {
    axios
      .get(`/api/v1/host_profiles?user_id=${id}&locale=${lang}`)
      .then(({ data }) => {
        if (!data.length) {
          setErrors((prev) => [...prev, 'reusable:errors:index-no-host-1']);
          setLoading(false);
          return;
        }
        const transformedResponse = transformResponseToHost(data[0]);
        setHost(transformedResponse);
        dispatch({
          type: 'HOST_PROFILE_FETCHED',
          hostProfile: transformedResponse,
        });
        setLoading(false);
      })
      .catch(({ response }) => {
        if (response === undefined) {
          //wipeCredentials('/is-not-available?atm');
        }
        if (response.status === 500) {
          setErrors((prev) => [...prev, 'reusable:errors:500']);
        }
        setErrors((prev) => [...prev, response.data.error]);
        setLoading(false);
      });
  }, []);

  return { loading, errors, host };
};

const transformResponseToHost = (data) => {
  return {
    name: data.user.nickname,
    location: data.user.location,
    avatar: data.user.profile_avatar,
    hostProfileId: data.id,
    userId: data.user.id,
    availability: data.availability,
    description: data.description,
    lat: data.lat,
    long: data.long,
    maxCats: data.max_cats_accepted,
    rate: data.price_per_day_1_cat,
    reviewsCount: data.reviews_count,
    score: data.score,
    supplement: data.supplement_price_per_cat_per_day,

    // checkInDate={checkInDate}
    // checkOutDate={checkOutDate}

    // handleHostProfileClick={handleHostProfileClick}
    // requestToBookButtonClick={requestToBookButtonClick}
    // hostAvailable={hostAvailable}
    // messageHost={messageHost}
    // allowToBook={hostId === id ? false : true}
  };
};
