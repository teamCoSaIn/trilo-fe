import styled, { css } from 'styled-components';

import {
  smallBtnStyle,
  mediumBtnStyle,
  largeBtnStyle,
  whiteBtnStyle,
  grayBtnStyle,
  blueBtnStyle,
} from '@/components/common/Button/style';

type TBtnSize = 'large' | 'medium' | 'small';
type TBtnColor = 'white' | 'gray' | 'blue';

const Button = styled.button<{ btnSize?: TBtnSize; btnColor?: TBtnColor }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

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
