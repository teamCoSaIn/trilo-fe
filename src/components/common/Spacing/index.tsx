import styled, { css } from 'styled-components';

const Spacing = styled.div<{
  width?: number;
  height?: number;
}>`
  flex: none;
  ${props => css`
    ${props.width && { width: props.width }}
    ${props.height && { height: props.height }}
  `};
`;

export default Spacing;
