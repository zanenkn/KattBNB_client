import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const { colors, spacing } = theme;

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Lato', sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  p, ul, li {
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    color: #59565E;
    font-weight: 400;
    margin: 0;
    line-height: 1.3em;
  }
  li {
    margin-bottom: 0.75rem;
  }
  p > ul, li {
    font-size: inherit;
    color: inherit;
  }
  li:last-child {
    margin-bottom: 0;
  }
  ul {
    padding-inline-start: 20px;
  }

  h1, h2, h3, h4, h5 {
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    margin: 0;
  }

  h1 {
    font-size: 2.488rem;
  }
  h2 {
    font-size: 2.074rem;
  }
  h3 {
    font-size: 1.728rem;
  }
  h4 {
    font-size: 1.44rem;
  }
  h5 {
    font-size: 1.2rem;
  }

  a {
    text-decoration: none;
    color: inherit;
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
  .spin-it {
    animation: rotation 2s infinite linear;
  }
  
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
  .editor-canvas {
    width: 100%!important;
    height: 100%!important;
    margin-bottom: 1rem;
  }
  .popup-content {
    border: none!important;
    padding: 2rem!important;
    width: 80%!important;
    max-width: 300px;
    max-height: 95%!important;
    display: table;
    box-sizing: border-box;
  }
  .avatar-popup-content {
    width: 270px!important;
    font-size: initial;
  }
  #retryButton {
    opacity: .2;
    cursor: pointer;
    display: flex;
  }
  .lds-spinner {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  
  .lds-spinner div {
    transform-origin: 40px 40px;
    animation: lds-spinner 1.2s linear infinite;
  }
  
  .lds-spinner div:after {
    content: " ";
    display: block;
    position: absolute;
    top: 3px;
    left: 37px;
    width: 6px;
    height: 18px;
    border-radius: 20%;
    background: #c90c61;
  }
  
  .lds-spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
  }
  
  .lds-spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
  }
  
  .lds-spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
  }
  
  .lds-spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
  }
  
  .lds-spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
  }
  
  .lds-spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
  }
  
  .lds-spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  
  .lds-spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
  }
  
  .lds-spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
  }
  
  .lds-spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
  }
  
  .lds-spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
  }
  
  .lds-spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
  }
  
  @keyframes lds-spinner {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .DayPickerInput > input {
    background-color: transparent;
    box-sizing: border-box;
    color: inherit;
    outline: none;
    border-radius: 3px;
    font-size: 16px;
    width: 100%;
    padding: ${spacing[4]} ${spacing[4]};
    border: 1px solid ${colors.neutral[60]};
    &:focus {
      border: 1px solid ${colors.neutral[100]};
    }
    &:-internal-autofill-selected {
      background-color: transparent;
    }
  }
`;

export default GlobalStyles;
