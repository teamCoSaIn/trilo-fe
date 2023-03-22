import styled, { css } from 'styled-components';

const Line = styled.div<{ width?: number; right?: number; left?: number }>`
  height: 1px;
  border-top: 1px solid #f1f1f1;
  ${props => css`
    ${props.width && { width: props.width }}
    ${props.left && { marginLeft: props.left }}
    ${props.right && { marginRight: props.right }}
  `}
`;

export default Line;
