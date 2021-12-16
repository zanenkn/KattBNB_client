import { colors, spacing } from '../constants';

const Supplement = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z' />
    </svg>
  );
};

export default Supplement;

Supplement.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
