import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
  body {
    font-family: 'Lato', sans-serif;
    margin: 0;
  }
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
  .nav-icon {
    height: 25px;
  }
  @media (min-height: 736px) {
    .nav-icon {
      height: 35px;
    }
  }
  @media (min-height: 1024px) {
    .nav-icon {
      height: 40px;
    }
  }
  
  #hamburger {
    display: flex;
  }
  .hamburger {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition-property: opacity, filter;
    transition-duration: 0.15s;
    transition-timing-function: linear;
    font: inherit;
    color: #ffffff;
    text-transform: none;
    background-color: transparent;
    border: 0;
    margin: auto;
    overflow: visible; 
  }
  
  .hamburger.is-active .hamburger-inner,
  .hamburger.is-active .hamburger-inner::before,
  .hamburger.is-active .hamburger-inner::after {
    background-color: #ffffff; 
  }
  
  .hamburger-box {
    width: 5vh;
    display: inline-block;
    position: relative; 
  }
  
  .hamburger-box:after {
    content:'';
    position:absolute;
    top:-10px; bottom:-10px; 
    left:-10px; right:-10px; 
  }
  
  .hamburger-inner {
    display: block;
    top: 50%;
    padding: 0;
  }
  
  .hamburger-inner, .hamburger-inner::before, .hamburger-inner::after {
    padding: 0;
    width: 5vh;
    height: 3px;
    background-color: #ffffff;
    position: absolute;
    transition-property: transform;
    transition-duration: 0.15s;
    transition-timing-function: ease; 
  }
  
  .hamburger-inner::before, .hamburger-inner::after {
    content: "";
    display: block; 
  }
  
  .hamburger-inner::before {
    top: -10px; 
  }
  
  .hamburger-inner::after {
    bottom: -10px; 
  }
  
  .hamburger--squeeze .hamburger-inner {
    transition-duration: 0.075s;
    transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); 
  }
  
  .hamburger--squeeze .hamburger-inner::before {
    transition: top 0.075s 0.12s ease, opacity 0.075s ease; 
  }
  
  .hamburger--squeeze .hamburger-inner::after {
    transition: bottom 0.075s 0.12s ease, transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19); 
  }
  
  .hamburger--squeeze.is-active .hamburger-inner {
    transform: rotate(45deg);
    transition-delay: 0.12s;
    transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1); 
  }
  .hamburger--squeeze.is-active .hamburger-inner::before {
    top: 0;
    opacity: 0;
    transition: top 0.075s ease, opacity 0.075s 0.12s ease; 
  }
  
  .hamburger--squeeze.is-active .hamburger-inner::after {
    bottom: 0;
    transform: rotate(-90deg);
    transition: bottom 0.075s ease, transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1); 
  }
`;

export default GlobalStyles;