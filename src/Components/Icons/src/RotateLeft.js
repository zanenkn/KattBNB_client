import { colors, spacing } from '../constants';

const RotateLeft = ({ fill, height, tint }) => (
  <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
    <path
      d='M0,10l4,4l4-4H5c0-3.3,2.7-6,6-6c3.3,0,6,2.7,6,6s-2.7,6-6,6h0v2c2,0,4.1-0.8,5.7-2.3c3.1-3.1,3.1-8.2,0-11.3
	c-3.1-3.1-8.2-3.1-11.3,0C3.8,5.8,3,7.9,3,10H0z'
    />
  </svg>
);

export default RotateLeft;

RotateLeft.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
