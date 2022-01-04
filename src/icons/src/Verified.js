import { colors, spacing } from '../constants';

const Verified = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path
        d='M10,0L1.82,3.64v5.45C1.82,14.14,5.3,18.85,10,20c4.7-1.15,8.18-5.86,8.18-10.91V3.64L10,0z M8.18,14.55l-3.64-3.64
	l1.29-1.29l2.35,2.35l5.99-5.99l1.29,1.29L8.18,14.55z'
      />
    </svg>
  );
};
export default Verified;

Verified.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
