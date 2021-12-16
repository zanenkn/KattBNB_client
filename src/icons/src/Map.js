import { colors, spacing } from '../constants';

const Map = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M0,0l6,4l8-4l6,4v16l-6-4l-8,4l-6-4V0z M7,6v11l6-3V3L7,6z' />
    </svg>
  );
};

export default Map;

Map.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
