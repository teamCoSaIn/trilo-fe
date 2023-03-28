import styled, { css } from 'styled-components';

const Spacing = styled.div<{
  size: number;
}>`
  flex: none;
  ${props => css`
    ${props.size && { height: props.size }}
  `};
`;

export default Spacing;
