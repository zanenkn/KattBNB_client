import React from 'react';

const Refresh = ({ height, className, fill }) => (
  <svg xmlns='http://www.w3.org/2000/svg' height={height} viewBox='0 0 20 20' className={className} fill={fill}>
    <path
      d='M10,3v2c-2.8,0-5,2.2-5,5c0,1.3,0.5,2.6,1.5,3.5l-1.4,1.4c-2.7-2.7-2.7-7.2,0-9.9C6.4,3.7,8.1,3,10,3z M14.9,5.1
	c2.7,2.7,2.7,7.2,0,9.9c-1.3,1.3-3.1,2.1-5,2.1v-2c2.8,0,5-2.2,5-5c0-1.3-0.5-2.6-1.5-3.5L14.9,5.1z M10,20l-4-4l4-4V20z M10,8V0
	l4,4L10,8z'
    />
  </svg>
);

export default Refresh;
