import { colors, spacing } from '../constants';

const UserRound = ({ fill, height, tint }) => {
  return (
    <svg
      fill={colors[fill][tint]}
      height={spacing[height]}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
    >
      <path d='M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Zm0,19a9,9,0,1,1,9-9A9,9,0,0,1,10,19Z' />
      <path d='M10,11a3,3,0,0,0,3-3V6a3,3,0,0,0-3-3A3,3,0,0,0,7,6V8A3,3,0,0,0,10,11Z' />
      <path d='M3.3,14.4a7.94,7.94,0,0,0,11.1,2.2,7.68,7.68,0,0,0,2.2-2.2A16.23,16.23,0,0,0,3.3,14.4Z' />
    </svg>
  );
};

export default UserRound;

UserRound.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
