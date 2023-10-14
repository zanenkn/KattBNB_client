import { useState, useEffect } from 'react';
import { deviceDimentions } from '../utils/deviceDimentions';

const getWindowDimension = () => {
  const deviceWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const deviceHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return { deviceWidth, deviceHeight };
};

const detectLanguage = () => {
  if (process.env.NODE_ENV === 'production') {
    if (
      window.localStorage.getItem('I18N_LANGUAGE') === null ||
      window.localStorage.getItem('I18N_LANGUAGE') === '' ||
      window.localStorage.getItem('I18N_LANGUAGE') === 'sv'
    ) {
      return 'sv-SE';
    } else {
      return 'en-US';
    }
  } else {
    return 'en-US';
  }
};

export default () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [type, setType] = useState('');
  const [orientation, setOrientation] = useState('');

  const locale = detectLanguage()

  const headers = {
    uid: window.localStorage.getItem('uid'),
    client: window.localStorage.getItem('client'),
    'access-token': window.localStorage.getItem('access-token'),
  };

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

  return { device: { width, height, type, orientation }, locale: locale, headers: headers };
};
