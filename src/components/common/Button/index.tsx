import styled, { css } from 'styled-components';

import {
  smallBtnStyle,
  mediumBtnStyle,
  largeBtnStyle,
  whiteBtnStyle,
  grayBtnStyle,
  blueBtnStyle,
} from '@/components/common/Button/style';

type BtnSizeType = 'large' | 'medium' | 'small';
type BtnColor = 'white' | 'gray' | 'blue';

const Button = styled.button<{ btnSize?: BtnSizeType; btnColor?: BtnColor }>`
  display: flex;
  justify-content: center;
  align-items: center;

  ${props => {
    switch (props.btnColor) {
      case 'white':
        return css`
          ${whiteBtnStyle}
        `;

      case 'gray':
        return css`
          ${grayBtnStyle}
        `;

      default:
        return css`
          ${blueBtnStyle}
        `;
    }
  }}

  ${props => {
    switch (props.btnSize) {
      case 'large':
        return css`
          ${largeBtnStyle}
        `;

      case 'medium':
        return css`
          ${mediumBtnStyle}
        `;

      default:
        return css`
          ${smallBtnStyle}
        `;
    }
  }}
`;

export default Button;
