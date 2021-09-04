import { colors, spacing } from '../constants';

const CheveronUp = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M10.7,7L10,6.3L4.3,12l1.4,1.4L10,9.2l4.2,4.2l1.4-1.4L10.7,7z' />
    </svg>
  );
};

export default CheveronUp;

CheveronUp.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
