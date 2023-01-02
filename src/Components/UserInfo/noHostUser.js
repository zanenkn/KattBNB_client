import { useEffect, useState } from 'react';

import axios from 'axios';
import Spinner from '../../common/Spinner';
import { Text, ContentWrapper, Avatar, Flexbox, Header, Notice } from '../../UI-Components';
import { User, Location } from '../../icons';

const NoHostUser = ({ id, t }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .get(`/api/v1/users/${id}`, { headers: headers })
      .then(({ data }) => {
        setUser({
          username: data.nickname,
          location: data.location,
          avatar: data.profile_avatar,
        });
      })
      .catch((error) => {
        if (error.response === undefined || error.response.status === 500) {
          setErrors(['reusable:errors.unknown']);
        } else {
          setErrors(error.response.data.errors);
        }
      });
  }, []);

  if (errors.length) {
    return (
      <ContentWrapper>
        <Notice nature='danger' data-cy='errors'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      </ContentWrapper>
    );
  }

  if (!user) return <Spinner />;

  return (
    <ContentWrapper>
      <Avatar
        centered
        space={4}
        src={
          user.avatar ??
          `https://ui-avatars.com/api/?name=${user.username}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
        }
      />
      <Flexbox spaceItemsX={1} space={2}>
        <User />
        <Header level={4}>{user.username}</Header>
      </Flexbox>
      <Flexbox spaceItemsX={1} space={6}>
        <Location />
        <Text>{user.location}</Text>
      </Flexbox>
      <Text centered italic>
        {t('UserInfo:no-profile')}
      </Text>
    </ContentWrapper>
  );
};

export default NoHostUser;
