import styled, { css } from 'styled-components';

const Flex = styled.div<{
  column?: boolean;
  justifyCenter?: boolean;
  alignCenter?: boolean;
}>`
  display: flex;
  ${props => css`
    ${props.column && {
      flexDirection: 'column',
    }}
    ${props.justifyCenter && {
      justifyContent: 'center',
    }}
    ${props.alignCenter && {
      alignItems: 'center',
    }}
  `}
`;

export default Flex;
