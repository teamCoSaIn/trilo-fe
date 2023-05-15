import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as LogoImg } from '@/assets/logo.svg';

interface LogoProps {
  width: number;
  height: number;
}

const Logo = ({ width, height }: LogoProps) => {
  return (
    <LogoBox>
      <Link to="/">
        <LogoImg width={width} height={height} />
      </Link>
    </LogoBox>
  );
};

const LogoBox = styled.h1`
  font-size: 2rem;
`;

export default Logo;
