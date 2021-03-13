import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

  p {
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    color: #808080;
    font-weight: 400;
    margin: 0.5rem 0 0 0;
    &first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-family: 'Lato', sans-serif;
    font-size: 2rem;
    color: #c90c61;
    font-weight: 700;
    margin: 0;
  }

  h2 {
    font-family: 'Lato', sans-serif;
    font-size: 1.7rem;
    color: #59565e;
    font-weight: 700;
    margin: 0;
  }
`;

export default GlobalStyles;
