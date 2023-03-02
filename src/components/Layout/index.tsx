import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from '@/components/Layout/Header';

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
`;
