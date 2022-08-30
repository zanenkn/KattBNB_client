import HostInfo from '../HostProfileView/hostInfo';
import { useFetchHost } from './HostPopup/useFetchHost';
import Spinner from '../../common/Spinner';
import { InnerResultWrapper } from './styles';

const Profile = ({ currentSearch, id, toRequest, messageHost }) => {
  const { host, loading } = useFetchHost(id);
  if (loading) return <Spinner />;
  return (
    <InnerResultWrapper>
      <HostInfo
        host={host}
        currentSearch={currentSearch}
        toRequest={() => toRequest()}
        messageHost={() => messageHost(host.userId)}
      />
    </InnerResultWrapper>
  );
};

export default Profile;
