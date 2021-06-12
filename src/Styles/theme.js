import React from "react";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    base: "#59565E",
    main: "#C90C61",
  }
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;