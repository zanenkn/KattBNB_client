import { useDeviceInfo } from '../../hooks/useDeviceInfo';

const Responsive = ({ displayIn, children }) => {
  const { type } = useDeviceInfo();
  return <>{displayIn.includes(type) ? children : null}</>;
};

export default Responsive;
