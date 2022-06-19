import { colors, spacing } from '../constants';

const Send = ({ fill, height, tint, ...rest }) => {
  return (
    <svg
      fill={colors[fill][tint]}
      height={spacing[height]}
      {...rest}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
    >
      <path d='M0,0l20,10L0,20V0z M0,8v4l10-2L0,8z' />
    </svg>
  );
};

export default Send;

Send.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
