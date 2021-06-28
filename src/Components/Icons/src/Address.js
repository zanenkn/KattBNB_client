import { colors, spacing } from '../constants';

const Address = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z' />
    </svg>
  );
};

export default Address;

Address.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
