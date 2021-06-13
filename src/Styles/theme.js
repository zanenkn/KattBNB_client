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
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.5rem',
    6: '2rem',
    7: '2.5rem',
    8: '3rem',
    9: '3.5rem',
    10: '4rem',
    11: '4.5rem',
    12: '5rem',
    13: '5.5rem',
    14: '6rem',
    15: '6.5rem',
    17: '7rem',
    18: '7.5rem',
  },
  screens: {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  fontWeights: {
    regular: 400,
    bold: 700,
  },
};

const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
