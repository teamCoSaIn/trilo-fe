import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as LogoImg } from '@/assets/logo.svg';
import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';

const Home = () => {
  return (
    <Layout column alignCenter>
      <Description color={color.white} fontSize={3}>
        Welcome to
      </Description>
      <Spacing height={42} />
      <LogoImg
        width={326}
        height={132}
        fill={color.white}
        style={{ flexShrink: 0 }}
      />
      <Spacing height={42} />
      <Description color={color.white} fontSize={2}>
        Trilo, 여행을 위한 완벽한 메모장
      </Description>
      <Spacing height={160} />
      <NewTripBtn btnColor="white">
        <NewTripLink to="/triplist">여행 계획 만들기</NewTripLink>
      </NewTripBtn>
    </Layout>
  );
};

const Layout = styled(Flex)`
  height: 100%;
  background: linear-gradient(
    180deg,
    #6aaae6 0%,
    #9ec4e6 57.29%,
    rgba(106, 170, 230, 0) 100%
  );
  padding-top: 100px;
`;

const NewTripBtn = styled(Button)`
  width: 185px;
  height: 51px;
  border-radius: 3rem;
  font-size: 1.6rem;
`;

const NewTripLink = styled(Link)`
  width: 100%;
  height: 100%;
  line-height: 51px;
  text-align: center;
  border-radius: 3rem;
`;

export default Home;
