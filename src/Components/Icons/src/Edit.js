import { colors, spacing } from '../constants';

const Edit = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M12.3,3.7l4,4L4,20H0v-4L12.3,3.7z M13.7,2.3L16,0l4,4l-2.3,2.3C17.7,6.3,13.7,2.3,13.7,2.3z' />
    </svg>
  );
};

export default Edit;

Edit.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
