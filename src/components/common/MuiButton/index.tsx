import { Button } from '@mui/material';
import styled, { css } from 'styled-components';

import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';

const MuiButton = styled(Button)<{ width?: number }>`
  height: ${HEADER_HEIGHT};
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
  `}
`;

export default MuiButton;
