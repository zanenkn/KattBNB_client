import { useState, useEffect } from 'react';
import { deviceDimentions } from '../utils/deviceDimentions';

const getWindowDimension = () => {
  const deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const deviceHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return { deviceWidth, deviceHeight };
};

export const useDeviceInfo = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [type, setType] = useState('');
  const [orientation, setOrientation] = useState('');

  const handleResize = () => {
    const { deviceWidth, deviceHeight } = getWindowDimension();
    setHeight(deviceHeight);
    setWidth(deviceWidth);

    if (deviceHeight > deviceWidth) {
      setOrientation('portrait');
    } else {
      setOrientation('landscape');
    }

    Object.keys(deviceDimentions).map((device) => {
      if (deviceWidth >= deviceDimentions[device]['min'] && deviceWidth <= deviceDimentions[device]['max']) {
        setType(device);
      }
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize, false);

    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
    // eslint-disable-next-line
  }, []);

  return { width, height, type, orientation };
};
