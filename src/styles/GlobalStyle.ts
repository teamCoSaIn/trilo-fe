import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  /* other styles */
  * {
    box-sizing: border-box;
  }
  html {
    font-size: 62.5%;
    height: 100%;
    // TripTripCardWidth(245) * 4 + TripTripCardBoxGap(28) * 3 + padding(100) * 2
    min-width: 1264px;
    min-height: 789px;
    margin: 0 auto;
    @media screen and (max-width: 767px) {
      // mobile
      min-width: 320px;
    }
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
  ul, li, ol{
    list-style: none;
  }
  .tippy-box {
    display: none !important;
    visibility: hidden !important;
  }
  ._bnEditor_dbz5y_3 {
    padding-inline: 10px !important;
  }
  ._blockContent_63zqr_10._isEmpty_63zqr_224._hasAnchor_63zqr_247>:first-child:before {
    content: "Enter text..." !important;
  }
  .Toastify__toast {
    font-size: 1.5rem;
}
`;

export default GlobalStyle;
