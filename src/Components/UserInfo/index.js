import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { detectLanguage } from '../../Modules/detectLanguage';
import { useFetchHost } from '../SearchResults/HostPopup/useFetchHost';
import Spinner from '../../common/Spinner';

import { ContentWrapper, Notice } from '../../UI-Components';

import NoHostUser from './noHostUser';
import HostInfo from '../HostInfo';

const UserInfo = ({ currentUserId, history }) => {
  const { t } = useTranslation('UserInfo');
  const { userId } = useParams();

  const [errors, setErrors] = useState([]);

  const messageHost = () => {
    const lang = detectLanguage();
    const path = '/api/v1/conversations';
    const payload = {
      user1_id: currentUserId,
      user2_id: userId,
      locale: lang,
    };
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };
    axios
      .post(path, payload, { headers: headers })
      .then(({ data }) => {
        history.push({
          pathname: `/conversation/${data.id}`,
        });
      })
      .catch(({ response }) => {
        if (response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (response.status === 500) {
          setErrors(['reusable:errors:500']);
        } else if (response.status === 422) {
          setErrors(['reusable:errors:422-conversation']);
        } else {
          setErrors(response.data.error);
        }
      });
  };

  const { host, loading } = useFetchHost(userId);

  if (loading) return <Spinner />;

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

  if (!host) {
    return <NoHostUser id={userId} t={t} />;
  }

  return (
    <ContentWrapper>
      <HostInfo host={host} messageHost={() => messageHost()} />
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ currentUserId: state.reduxTokenAuth.currentUser.attributes.id });

export default connect(mapStateToProps)(UserInfo);
