import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import backgroundImg from '@/assets/home/background.png';
import laptopImg from '@/assets/home/laptop.png';
import leftWindowImg from '@/assets/home/leftWindow.png';
import rightWindowImg from '@/assets/home/rightWindow.png';
import tripListImg from '@/assets/home/tripList.png';
import { ReactComponent as LogoImg } from '@/assets/logo.svg';
import { ReactComponent as DownArrow } from '@/assets/whiteDownArrow.svg';
import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { HOME_CONTENT_Z_INDEX } from '@/constants/zIndex';
import useMedia from '@/hooks/useMedia';

const Home = () => {
  const { isMobile } = useMedia();

  const [observedContentNum, setObservedContentNum] = useState(0);

  const intersectionCallback: IntersectionObserverCallback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setObservedContentNum(prev => prev + 1);
      }
    });
  };

  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(
    new IntersectionObserver(intersectionCallback)
  );

  const observeTarget = (refElement: HTMLDivElement) => {
    if (refElement && observerRef.current) {
      observerRef.current.observe(refElement);
    }
  };

  const handleDownBtnClick = () => {
    scrollTargetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Layout column alignCenter>
      <MainContent column alignCenter>
        <Description color={color.white} fontSize={isMobile ? 1.8 : 3}>
          Welcome to
        </Description>
        <Spacing height={42} />
        <LogoImg
          width={isMobile ? 208 : 326}
          height={isMobile ? 84 : 132}
          fill={color.white}
          style={{ flexShrink: 0 }}
        />
        <Spacing height={42} />
        <Description color={color.white} fontSize={isMobile ? 1.8 : 2}>
          Trilo, 여행을 위한 완벽한 메모장
        </Description>
        <Spacing height={150} />
        <NewTripBtn btnColor="white">
          <NewTripLink to="/triplist">여행 계획 만들기</NewTripLink>
        </NewTripBtn>
        <Spacing height={50} />
        <DownBtn onClick={handleDownBtnClick} isMobile={isMobile}>
          <DownArrow />
        </DownBtn>
      </MainContent>
      <Content
        column
        alignCenter
        ref={observeTarget}
        isObserved={observedContentNum >= 1}
      >
        <Spacing height={50} ref={scrollTargetRef} />
        <ContentText color={color.gray3} fontSize={isMobile ? 1.5 : 3.2}>
          여행 계획, 평소에 어떻게 짜셨나요? <br />
          <br />
          엑셀, 다이어리, 메모장 여러가지 섞어서 사용하시다가 짜증나신 적은
          없으신가요? <br />
          <br />
          트릴로는 모든 여행 계획을 한눈에 기록하는 쉽고 편한 여행 메모장입니다.
        </ContentText>
        <Spacing height={100} />
        <ContentImage
          src={laptopImg}
          alt="trilo가 실행된 노트북 이미지"
          width={isMobile ? 300 : 600}
        />
      </Content>
      <Content
        column
        alignCenter
        ref={observeTarget}
        isObserved={observedContentNum >= 2}
      >
        <Description fontSize={isMobile ? 2 : 4} color={color.blue3}>
          여행 기록
        </Description>
        <Spacing height={40} />
        <ContentText fontSize={isMobile ? 1.6 : 2.4} color="#767676">
          새로운 여행계획을 생성하세요.
          <br />
          <br />
          지난 여행 계획도 여기에서 보실 수 있어요.
        </ContentText>
        <Spacing height={100} />
        <ContentImage
          src={tripListImg}
          alt="trilo 여행 목록 페이지 이미지"
          width={isMobile ? 320 : 750}
        />
      </Content>
      <Content
        column
        alignCenter
        ref={observeTarget}
        isObserved={observedContentNum >= 3}
      >
        <Description fontSize={isMobile ? 2 : 4} color={color.blue3}>
          장소 검색
        </Description>
        <Spacing height={40} />
        <ContentText fontSize={isMobile ? 1.6 : 2.4} color="#767676">
          유명한 관광지, 맛집, 액티비티 편하게 검색해보세요.
          <br />
          <br />
          동선을 고려하여 여행지를 계획할 수 있어요.
        </ContentText>
        <Spacing height={100} />
        <ContentImage
          src={leftWindowImg}
          alt="trilo 여행 계획 페이지 장소 검색 이미지"
          width={isMobile ? 300 : 700}
        />
      </Content>
      <Content
        column
        alignCenter
        ref={observeTarget}
        isObserved={observedContentNum >= 4}
      >
        <Description fontSize={isMobile ? 2 : 4} color={color.blue3}>
          나만의 여행 메모장
        </Description>
        <Spacing height={40} />
        <ContentText fontSize={isMobile ? 1.6 : 2.4} color="#767676">
          드래그하여 일정을 자유롭게 수정할 수 있어요.
          <br />
          <br />
          여행과 관련된 사소한 메모를 해보세요.
        </ContentText>
        <Spacing height={100} />
        <ContentImage
          src={rightWindowImg}
          alt="trilo 여행 계획 페이지 일정 목록 이미지"
          width={isMobile ? 200 : 400}
        />
        <Spacing height={100} />
        <ContentText fontSize={isMobile ? 1.6 : 2.4} color="#767676">
          이제 여행 계획을 만들어 볼까요?
        </ContentText>
        <Spacing height={40} />
        <NewTripBtn btnColor="blue">
          <NewTripLink to="/triplist">여행 계획 만들기</NewTripLink>
        </NewTripBtn>
        <Spacing height={100} />
      </Content>
      <BackgroundImage src={backgroundImg} alt="homepage background" />
    </Layout>
  );
};

const Layout = styled(Flex)`
  position: relative;
  height: 100%;
`;

const MainContent = styled(Flex)`
  position: relative;
  min-height: 500px;
  height: 100%;
  max-height: 1200px;
  padding: 50px 0;
  opacity: 0;
  animation: show 0.5s ease-in-out 0.5s 1 normal forwards running;
  @keyframes show {
    0% {
      opacity: 0;
      transform: translate3d(0px, 50px, 0px);
    }
    100% {
      opacity: 1;
      transform: translate3d(0px, 0px, 0px);
    }
  }
  z-index: ${HOME_CONTENT_Z_INDEX};
  flex-shrink: 0;
`;

const Content = styled(Flex)<{ isObserved: boolean }>`
  @media screen and (max-height: 1199px) {
    min-height: 100%;
  }
  @media screen and (min-height: 1200px) {
    height: 1000px;
  }
  padding: 50px 0;
  opacity: 0;
  ${({ isObserved }) => css`
    ${isObserved && {
      animation: `show 0.5s ease-in-out 0.5s 1 normal forwards running`,
    }}
  `};
  @keyframes show {
    0% {
      opacity: 0;
      transform: translate3d(0px, 50px, 0px);
    }
    100% {
      opacity: 1;
      transform: translate3d(0px, 0px, 0px);
    }
  }
  z-index: ${HOME_CONTENT_Z_INDEX};
  flex-shrink: 0;
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

const DownBtn = styled.button<{ isMobile: boolean }>`
  position: absolute;
  bottom: 10px;
  animation: flow 1s linear infinite alternate;
  @keyframes flow {
    0% {
      transform: translate3d(0px, 5px, 0px);
    }
    100% {
      transform: translate3d(0px, -5px, 0px);
    }
  }
  z-index: ${HOME_CONTENT_Z_INDEX};
  ${({ isMobile }) => {
    if (isMobile) {
      return css`
        path {
          fill: ${color.blue2};
        }
        circle {
          stroke: ${color.blue2};
        }
      `;
    }
  }}
  &:hover {
    path {
      fill: ${color.blue3};
    }
    circle {
      stroke: ${color.blue3};
    }
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  width: 100%;
`;

const ContentText = styled(Description)`
  text-align: center;
`;

const ContentImage = styled.img``;

export default Home;
