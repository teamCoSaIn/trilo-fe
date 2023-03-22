import { Button } from '@mui/material';
import styled, { css } from 'styled-components';

const MuiButton = styled(Button)<{ width?: number }>`
  height: 94px;
  padding: 0px;
  color: #3867ff;
  font-size: 1.6rem;
  text-align: center;
  border-radius: 0px;
  &:hover {
    background-color: #eaefff;
  }
  ${props => css`
    ${props.width && { width: props.width }}
  `}
`;

export default MuiButton;
