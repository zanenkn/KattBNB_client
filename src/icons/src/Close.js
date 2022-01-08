import { colors, spacing } from '../constants';

const Close = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      	<polygon points="13.1,10 20,16.9 16.9,20 10,13.1 3.1,20 0,16.9 6.9,10 0,3.1 3.1,0 10,6.9 16.9,0 20,3.1 	"/>
    </svg>
  );
};

export default Close;

Close.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
