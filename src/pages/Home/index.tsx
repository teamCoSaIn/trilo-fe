import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@/components/common/Button';

const Home = () => {
  return (
    <div>
      <h1>홈 페이지입니다.</h1>
      <NewTripBtn btnColor="white">
        <Link to="/triplist">여행 계획 만들기</Link>
      </NewTripBtn>
    </div>
  );
};

const NewTripBtn = styled(Button)`
  position: absolute;
  bottom: 86px;
  right: 199px;
  width: 185px;
  height: 51px;
  border-radius: 3rem;
  font-size: 1.6rem;
`;

export default Home;
