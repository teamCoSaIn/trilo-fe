import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  /* other styles */
  * {
    box-sizing: border-box;
  }
  html {
    font-size: 10px;
    height: 100%;
  }
  body {
    height: 100%;
  }
  #root {
    height: 100%;
  }
  input {
    border: none;
    background-color: transparent;
    outline: none;
    font-family: inherit;
    padding: 0;
  }
  button {
    cursor: pointer;
    border: none;
    background-color: transparent;
    padding: 0;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  ui, li, ol{
    list-style: none;
  }
`;

export default GlobalStyle;
