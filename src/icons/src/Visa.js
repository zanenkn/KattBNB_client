import { spacing } from '../constants';

const Visa = ({ height }) => {
  return (
    <svg height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 283.46 198.43'>
      <path
        fill='#1166B0'
        d='M253.58,198.43H29.88C13.38,198.43,0,185.05,0,168.54V29.88C0,13.38,13.38,0,29.88,0h223.7
		c16.5,0,29.88,13.38,29.88,29.88v138.66C283.46,185.05,270.09,198.43,253.58,198.43z'
      />
      <polygon fill='#FFFFFF' points='129.7,130.3 114.93,130.3 124.16,73.93 138.93,73.93 			' />
      <path
        fill='#FFFFFF'
        d='M102.51,73.93L88.44,112.7l-1.67-8.35l0,0L81.81,79c0,0-0.6-5.08-7-5.08H51.53l-0.27,0.95
				c0,0,7.12,1.47,15.44,6.45l12.83,48.97h15.38l23.49-56.37H102.51z'
      />
      <path
        fill='#FFFFFF'
        d='M218.64,130.3h13.56l-11.82-56.37h-11.87c-5.48,0-6.82,4.2-6.82,4.2l-22.02,52.17h15.39
				l3.08-8.37h18.77L218.64,130.3z M202.4,110.36l7.76-21.1l4.36,21.1H202.4z'
      />
      <path
        fill='#FFFFFF'
        d='M180.83,87.48l2.11-12.11c0,0-6.5-2.46-13.28-2.46c-7.33,0-24.73,3.19-24.73,18.66
				c0,14.56,20.42,14.75,20.42,22.39s-18.32,6.28-24.36,1.46l-2.2,12.66c0,0,6.59,3.19,16.67,3.19c10.07,0,25.28-5.19,25.28-19.3
				c0-14.66-20.6-16.02-20.6-22.39C160.13,83.2,174.51,84.02,180.83,87.48z'
      />
      <path
        fill='#F7A536'
        d='M86.77,104.35L81.81,79c0,0-0.6-5.08-7-5.08H51.53l-0.27,0.95c0,0,11.18,2.3,21.91,10.94
			C83.43,94.07,86.77,104.35,86.77,104.35z'
      />
    </svg>
  );
};

export default Visa;

Visa.defaultProps = {
  height: 4,
};
