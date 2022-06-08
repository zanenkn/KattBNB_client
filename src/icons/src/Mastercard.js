import { spacing } from '../constants';

const Mastercard = ({ height }) => {
  return (
    <svg height={spacing[height]} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 283.46 198.43'>
      <path
        fill='#374A5D'
        d='M253.58,198.43H29.88C13.38,198.43,0,185.05,0,168.54V29.88C0,13.38,13.38,0,29.88,0h223.7
      c16.5,0,29.88,13.38,29.88,29.88v138.66C283.46,185.05,270.09,198.43,253.58,198.43z'
      />
      <rect x='117.92' y='56.68' fill='#EC6625' width='47.62' height='85.07' />
      <path
        fill='#E51F26'
        d='M120.94,99.21c0-17.26,8.13-32.63,20.79-42.53c-9.26-7.25-20.94-11.57-33.64-11.57
        c-30.06,0-54.42,24.22-54.42,54.1c0,29.88,24.37,54.1,54.42,54.1c12.7,0,24.38-4.32,33.64-11.57
        C129.07,131.84,120.94,116.47,120.94,99.21'
      />
      <path
        fill='#F59E21'
        d='M229.79,99.21c0,29.88-24.37,54.1-54.42,54.1c-12.7,0-24.38-4.32-33.63-11.57
        c12.66-9.9,20.78-25.28,20.78-42.53s-8.13-32.63-20.78-42.53c9.26-7.24,20.94-11.56,33.63-11.56
        C205.42,45.11,229.79,69.33,229.79,99.21 M224.6,132.73v-1.74h0.71v-0.35h-1.8v0.35h0.71v1.74H224.6z M228.09,132.73v-2.1h-0.55
        l-0.63,1.44l-0.63-1.44h-0.55v2.1h0.39v-1.58l0.59,1.37h0.4l0.59-1.37v1.59H228.09z'
      />
    </svg>
  );
};

export default Mastercard;

Mastercard.defaultProps = {
  height: 4,
};
