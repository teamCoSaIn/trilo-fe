import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from '@/components/Header';
import { HEADER_HEIGHT } from '@/constants/size';

const HeaderLayout = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default HeaderLayout;

const Container = styled.div`
  width: 100%;
  height: calc(100% - ${HEADER_HEIGHT}px);
`;
