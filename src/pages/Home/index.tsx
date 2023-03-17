import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Home = () => {
  return (
    <div>
      <h1>홈 페이지입니다.</h1>
      <NewTripLink to="/trip-list">여행 계획 만들기</NewTripLink>
    </div>
  );
};

const NewTripLink = styled(Link)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 185px;
  height: 51px;
  bottom: 86px;
  right: 199px;
  font-size: 1.6rem;
  color: #96afff;
  border: 1px solid #96afff;
  border-radius: 3rem;
`;
export default Home;
