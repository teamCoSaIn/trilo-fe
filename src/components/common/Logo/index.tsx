import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as LogoImg } from '@/assets/logo.svg';

const Logo = () => {
  return (
    <LogoBox>
      <Link to="/">
        <LogoImg />
      </Link>
    </LogoBox>
  );
};

const LogoBox = styled.h1`
  font-size: 2rem;
`;

export default Logo;
