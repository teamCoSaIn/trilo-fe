import styled, { css } from 'styled-components';

const Spacer = styled.div<{
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => css`
    ${props.top && { marginTop: props.top }}
    ${props.bottom && { marginBottom: props.bottom }}
    ${props.left && { marginLeft: props.left }}
    ${props.right && { marginRight: props.right }}
  `};
`;

export default Spacer;
