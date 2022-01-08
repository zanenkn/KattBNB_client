import { colors, spacing } from '../constants';

const Menu = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path d='M20,4.2H0V0h20V4.2z' />
      <path d='M20,12.1H0V7.9h20V12.1z' />
      <path d='M20,20H0v-4.2h20V20z' />
    </svg>
  );
};

export default Menu;

Menu.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
