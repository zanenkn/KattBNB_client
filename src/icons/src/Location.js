import { colors, spacing } from '../constants';

const Location = ({fill, height, tint}) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'></path>
    </svg>
  );
};

export default Location;

Location.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
}
