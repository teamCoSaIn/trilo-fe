import styled, { css } from 'styled-components';

const Description = styled.p<{ color?: string; fontSize?: number }>`
  font-weight: 500;
  ${props => css`
    ${props.color && { color: props.color }}
    ${props.fontSize && { fontSize: `${props.fontSize}rem` }}
  `};
`;

export default Description;
