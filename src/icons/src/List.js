import { colors, spacing } from '../constants';

const List = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M1,4h2v2H1V4z M5,4h14v2H5V4z M1,9h2v2H1V9z M5,9h14v2H5V9z M1,14h2v2H1V14z M5,14h14v2H5V14z' />
    </svg>
  );
};

export default List;

List.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
