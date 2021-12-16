import { colors, spacing } from '../constants';

const CheveronLeft = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M7.1,9.3L6.3,10l5.7,5.7l1.4-1.4L9.2,10l4.2-4.2L12,4.3L7.1,9.3z' />
    </svg>
  );
};

export default CheveronLeft;

CheveronLeft.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
