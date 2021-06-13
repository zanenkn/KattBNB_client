import React from 'react';
import { ThemeProvider } from 'styled-components';

export const theme = {
  colors: {
    base: '#59565E',
    main: '#C90C61',
    mainDarker: '#A0094D',
  },
  spacing: {
    0: '0',
    1: '0.354rem',
    2: '0.5rem',
    3: '0.707rem',
    4: '1rem',
    5: '1.414rem',
    6: '1.999rem',
    7: '2.827rem',
    8: '3.998rem',
    9: '5.653rem',
  },
};

const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
