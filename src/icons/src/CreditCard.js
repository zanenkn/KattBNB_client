import { colors, spacing } from '../constants';

const CreditCard = ({ fill, height, tint }) => {
  return (
    <svg fill={colors[fill][tint]} height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
      <path
        d='M18,6V4H2v2H18z M18,10H2v6h16V10z M0,4c0-1.1,0.9-2,2-2h16c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V4z
	 M4,12h4v2H4V12z'
      />
    </svg>
  );
};

export default CreditCard;

CreditCard.defaultProps = {
  fill: 'neutral',
  height: 4,
  tint: 100,
};
