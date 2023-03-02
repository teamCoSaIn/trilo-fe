import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Logo = () => {
  return (
    <LogoBox>
      <Link to="/">Logo</Link>
    </LogoBox>
  );
};

const LogoBox = styled.h1`
  font-size: 2rem;
`;

export default Logo;
