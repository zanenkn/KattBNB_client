import { colors, spacing } from '../constants';

const HostProfile = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M10,0,0,10H3V20H17V10h3ZM7.89,9.3a2.11,2.11,0,0,1,4.22,0v.85a2.11,2.11,0,1,1-4.22,0Zm6.33,7.33H5.78v-2.4a8.44,8.44,0,0,1,8.44,0Z' />
    </svg>
  );
};

export default HostProfile;

HostProfile.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
