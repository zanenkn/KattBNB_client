import { useEffect, useState } from 'react';
import axios from 'axios';
import { Text, ContentWrapper } from '../../UI-Components';

const NoHostUser = ({ id, t }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // this is WIP, backend needs to be updated
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .get(`/api/v1/users/${id}`, { headers: headers })
      .then(({ data }) => {
        console.log(data);
      })
      .catch(() => {
        setErrors(['reusable:errors.unknown']);
      });
  }, []);
  return (
    <ContentWrapper>
      {/* <Avatar
        centered
        space={4}
        src={
          host.avatar ??
          `https://ui-avatars.com/api/?name=${host.name}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
        }
      />
      {host.reviewsCount && <ReviewScore center score={host.score} primaryColor={'neutral'} />}
      <Flexbox spaceItemsX={1} space={2}>
        <User />
        <Header level={4}>{host.name}</Header>
      </Flexbox> */}
      <Text>{t('UserInfo:no-profile')}</Text>
    </ContentWrapper>
  );
};

export default NoHostUser;
