import { colors, spacing } from '../constants';

const Arrow = ({ fill, height, tint, direction, ...rest }) => {
  const rotationMap = {
    up: 0,
    right: 90,
    down: 180,
    left: -90,
  };
  return (
    <svg
      fill={colors[fill][tint]}
      height={spacing[height]}
      {...rest}
      style={{ transform: `rotate(${rotationMap[direction]}deg)` }}
      viewBox='0 0 20 20'
    >
      <path d='M9,3.8L2.9,9.9L1.5,8.5L10,0l0.7,0.7l7.8,7.8l-1.4,1.4L11,3.8V20H9V3.8z' />
    </svg>
  );
};

export default Arrow;

Arrow.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
  direction: 'up',
};
