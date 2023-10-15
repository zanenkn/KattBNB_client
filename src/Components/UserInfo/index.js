import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { useFetchHost } from './useFetchHost';
import withFooter from '../../HOC/withFooter';
import Spinner from '../../common/Spinner';
import SEO from '../../common/SEO';
import { useStartConversation } from '../../utils/useStartConversation';

import { ContentWrapper, Notice } from '../../UI-Components';

import NoHostUser from './noHostUser';
import HostInfo from '../HostInfo';

const UserInfo = ({ currentUserId }) => {
  const { t } = useTranslation('UserInfo');
  const { userId } = useParams();

  const { startConversation, errors } = useStartConversation();
  const { host, loading } = useFetchHost(userId);

  if (loading) return <Spinner page />;

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
      <SEO
        title={`${host.name} - din kattvakt i ${host.location}`}
        description={host.description}
        href={`/user/${userId}`}
        type='website'
        dynamicOGimg={`https://kattbnb-og.herokuapp.com/ogimage?name=${host.name}&location=${host.location}${host.avatar ? `&avatar=${encodeURIComponent(host.avatar)}` : ''}`}
      />

      <HostInfo host={host} messageHost={() => startConversation({ userId1: currentUserId, userId2: userId })} />
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({ currentUserId: state.reduxTokenAuth.currentUser.attributes.id });

export default withFooter(connect(mapStateToProps)(UserInfo));
