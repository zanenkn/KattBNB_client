import React from 'react';
import { ThemeProvider } from 'styled-components';

export const theme = {
  colors: {
    primary: {
      110: '#A0094D',
      100: '#C90C61',
    },
    neutral: {
      110: '#3e3c41',
      100: '#59565E',
      80: '#807c87',
      60: '#a8a5ac',
      40: '#c5c3c8',
      20: '#e3e2e5',
      10: '#f7f7f7',
    },
    success: {
      100: '#99cc99',
      110: '#89B789',
      120: '#415341',
      20: '#ECF5EC',
    },
    danger: {
      100: '#E58F93',
      110: '#E0767A',
      120: '#5B393A',
      20: '#fff0ee'
    }
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
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '20px',
    xl: '24px',
  }
};

const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
