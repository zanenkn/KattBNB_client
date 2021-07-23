import React from 'react';
import { ThemeProvider } from 'styled-components';

export const theme = {
  colors: {
    primary: {
      120: '#5a052b',
      110: '#910946',
      100: '#C90C61',
      80: '#c85b8c',
      60: '#e78bb4',
      40: '#f1bcd4',
      20: '#f7dde8',
      10: '#FDF7FA',
    },
    neutral: {
      120: '#1f1e21',
      110: '#3c3a3f',
      100: '#59565E',
      80: '#807c87',
      60: '#a8a5ac',
      40: '#c5c3c8',
      20: '#e3e2e5',
      10: '#f7f7f7',
      0: '#fff',
    },
    success: {
      120: '#45612f',
      110: '#6A9648',
      100: '#92bb72',
      80: '#a6c88c',
      60: '#cfe1c1',
      40: '#e4eedc',
      20: '#eef4e9',
      10: '#f8fbf6',
    },
    danger: {
      120: '#882a2a',
      110: '#b53838',
      100: '#D16B6B',
      80: '#da8989',
      60: '#edc5c5',
      40: '#f6e3e3',
      20: '#fbf2f2',
      10: '#FCF7F7',
    },
    info: {
      120: '#3e5e7c',
      110: '#5c85ad',
      100: '#90ACC7',
      80: '#aabfd4',
      60: '#CFDCE8',
      40: '#E7EEF5',
      20: '#F2F7FC',
      10: '#f8fafc',
    },
    white: {
      100: '#fff',
    },
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
  },
};

const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

export default Theme;
