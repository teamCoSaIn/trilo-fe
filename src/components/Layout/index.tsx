import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from '@/components/Layout/Header';
import { HEADER_HEIGHT } from '@/styles/constants';

const Layout = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;

const Container = styled.div`
  color: blue;
  width: 100%;
  height: calc(100% - ${HEADER_HEIGHT});
  background-color: skyblue;
`;
