import { colors, spacing } from '../constants';

const Trash = ({ fill, height, tint, ...rest }) => (
  <svg fill={colors[fill][tint]} height={spacing[height]} {...rest} viewBox='0 0 20 20'>
    <path d='M6,2l2-2h4l2,2h4v2H2V2H6z M3,6h14l-1,14H4L3,6z M8,8v10h1V8H8z M11,8v10h1V8H11z' />
  </svg>
);

export default Trash;

Trash.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
