import HostInfo from '../HostProfileView/hostInfo';
import { useFetchHost } from './HostPopup/useFetchHost';
import Spinner from '../../common/Spinner';

const Profile = ({ currentSearch, id }) => {
  const { host, loading } = useFetchHost(id);
  if (loading) return <Spinner />;
  return (
    <>
      <p>{currentSearch.start}</p>
      <p>{host.name}</p>
      <HostInfo host={host} />
    </>
  );
};

export default Profile;
