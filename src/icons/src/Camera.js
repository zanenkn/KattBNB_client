import { colors, spacing } from '../constants';

const Camera = ({ fill, height, tint, ...rest }) => {
  return (
    <svg
      fill={colors[fill][tint]}
      height={spacing[height]}
      {...rest}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
    >
      <path
        d='M0,6c0-1.1,0.9-2,2-2h3l2-2h6l2,2h3c1.1,0,2,0.9,2,2v10c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V6z M10,16c2.8,0,5-2.2,5-5
	s-2.2-5-5-5s-5,2.2-5,5S7.2,16,10,16z M10,14c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S11.7,14,10,14z'
      />
    </svg>
  );
};

export default Camera;

Camera.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
