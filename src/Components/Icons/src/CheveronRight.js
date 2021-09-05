import { colors, spacing } from '../constants';

const CheveronRight = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M12.7,10.7l0.7-0.7L7.8,4.3L6.3,5.8l4.2,4.2l-4.2,4.2l1.4,1.4L12.7,10.7z' />
    </svg>
  );
};

export default CheveronRight;

CheveronRight.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
