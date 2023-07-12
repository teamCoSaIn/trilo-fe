import { Outlet } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Header from '@/components/Header';
import { HEADER_HEIGHT, MOBILE_HEADER_HEIGHT } from '@/constants/size';
import useMedia from '@/hooks/useMedia';

const HeaderLayout = () => {
  const { isDesktop } = useMedia();

  return (
    <>
      <Header />
      <Container isDesktop={isDesktop}>
        <Outlet />
      </Container>
    </>
  );
};

export default HeaderLayout;

const Container = styled.div<{ isDesktop: boolean }>`
  width: 100%;
  ${({ isDesktop }) => {
    if (isDesktop) {
      return css`
        height: calc(100% - ${HEADER_HEIGHT}px);
      `;
    }
    return css`
      height: calc(100% - ${MOBILE_HEADER_HEIGHT}px);
    `;
  }}
`;
