import { colors, spacing } from '../constants';

const Checkmark = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M0,11l2-2l5,5L18,3l2,2L7,18L0,11z' />
    </svg>
  );
};

export default Checkmark;

Checkmark.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
