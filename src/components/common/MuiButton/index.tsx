import { Button } from '@mui/material';
import styled, { css } from 'styled-components';

import color from '@/constants/color';

const MuiButton = styled(Button)<{ width?: number; height?: number }>`
  padding: 0;
  color: #3867ff;
  font-size: 1.6rem;
  text-align: center;
  border-radius: 0;
  &:hover {
    background-color: ${color.blue1};
  }
  ${props => css`
    ${props.width && { width: props.width }}
    ${props.height && { height: props.height }}
  `}
`;

export default MuiButton;
