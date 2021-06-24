import { colors, spacing } from '../constants';

const RotateRight = ({ fill, height, tint }) => (
  <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
    <path
      d='M20,10l-4,4l-4-4h3c0-3.3-2.7-6-6-6c-3.3,0-6,2.7-6,6s2.7,6,6,6h0v2c-2,0-4.1-0.8-5.7-2.3c-3.1-3.1-3.1-8.2,0-11.3
	c3.1-3.1,8.2-3.1,11.3,0C16.2,5.8,17,7.9,17,10H20z'
    />
  </svg>
);

export default RotateRight;

RotateRight.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
