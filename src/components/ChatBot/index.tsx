import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { requestChat } from '@/api/chat';
import { IUserProfile } from '@/api/user';
import chatbotImgUrl from '@/assets/chatbot.png';
import { ReactComponent as LogoIcon } from '@/assets/logo.svg';
import { ReactComponent as CloseIcon } from '@/assets/multiply.svg';
import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Spacing from '@/components/common/Spacing';
import color from '@/constants/color';
import { HEADER_HEIGHT } from '@/constants/size';
import { CHATBOT_Z_INDEX } from '@/constants/zIndex';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { UserId } from '@/states/userStatus';

interface IChat {
  isBot: boolean;
  text: string;
}

interface IBoxPosition {
  bottom: number;
  right: number;
}

const OPEN_BTN_DIAMETER = 70;
const CHAT_WINDOW_WIDTH = 400;
const CHAT_WINDOW_HEIGHT = 600;

const ChatBot = () => {
  const CHAT_INPUT_PLACEHOLDER = {
    default: '궁금한 것을 물어보세요.',
    error: '채팅 이용 불가',
  };
  const CHATBOT_INIT_BOTTOM = 20;
  const CHATBOT_INIT_RIGHT = 20;

  const userId = useRecoilValue(UserId);
  const { data: userProfileData } = useGetUserProfile({ userId });

  const [boxPosition, setBoxPosition] = useState<IBoxPosition>({
    bottom: CHATBOT_INIT_BOTTOM,
    right: CHATBOT_INIT_RIGHT,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<IChat[]>([
    {
      text: `안녕하세요 ${
        (userProfileData as IUserProfile).nickName
      }님. 여행 정보에 대해 궁금하신 내용이 있으시면 물어봐주세요!`,
      isBot: true,
    },
    { text: '뉴욕에 맛있는 스테이크집을 추천해줘', isBot: false },
    {
      text: `Peter Luger Steak House - 뉴욕에서 오랫동안 사랑받고 있는 유명한 스테이크 하우스입니다. 스테이크의 질과 육질이 매우 훌륭하며, 전통적인 스테이크 하우스 분위기를 즐길 수 있습니다.

    Keens Steakhouse - 뉴욕에서 가장 오래된 스테이크 하우스 중 하나로, 고전적인 분위기와 다양한 스테이크 옵션을 제공합니다. 특히, 램치쇠 스테이크로 유명합니다.
    
    Delmonico's - 뉴욕에서 가장 오래된 연속 운영 레스토랑 중 하나로, 뛰어난 스테이크와 멋진 서비스로 유명합니다.
    
    Wolfgang's Steakhouse - 전 세계적으로 유명한 스테이크 하우스 체인의 뉴욕 지점입니다. 높은 품질의 스테이크와 멋진 앰비언스를 즐길 수 있습니다.
    
    BLT Steak - 뉴욕의 미디어 구역에 위치한 이 곳은 현대적인 분위기와 다양한 스테이크 옵션을 제공합니다.`,
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatInputRef = useRef<HTMLInputElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const isDragging = useRef<boolean>(false);
  const isMouseDown = useRef<boolean>(false);
  const chatBoxPosition = useRef<IBoxPosition>({
    bottom: 0,
    right: 0,
  });
  const chatInputPlaceHolder = useRef<string>(CHAT_INPUT_PLACEHOLDER.default);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const chatList = chatHistory.map((chat, idx) => {
    return (
      <ChatBox key={idx} isBot={chat.isBot}>
        <ChatImg
          src={
            chat.isBot
              ? chatbotImgUrl
              : (userProfileData as IUserProfile).profileImageURL
          }
        />
        <Text isBot={chat.isBot}>{chat.text}</Text>
      </ChatBox>
    );
  });

  const chatLoadingDot = (
    <ChatBox isBot alignCenter>
      <ChatImg src={chatbotImgUrl} />
      <DotFlashing />
    </ChatBox>
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (chatInputRef.current) {
      const text = chatInputRef.current.value;
      if (!text) {
        return;
      }
      const reqChat = { text, isBot: false };

      setChatHistory(prev => [...prev, reqChat]);
      setIsLoading(true);
      chatInputRef.current.value = '';

      try {
        const res = await requestChat(text);
        const resChat = { text: res.choices[0].message.content, isBot: true };
        setChatHistory(prev => [...prev, resChat]);
      } catch {
        toast.error('현재 트롱봇을 사용할 수 없습니다.', {
          autoClose: 3000,
          pauseOnHover: false,
          draggable: false,
        });
        chatInputRef.current.disabled = true;
        chatInputPlaceHolder.current = CHAT_INPUT_PLACEHOLDER.error;
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenBtnClick = () => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }

    if (openBtnRef.current) {
      const { left, top, height, width } =
        openBtnRef.current.getBoundingClientRect();
      const [centerX, centerY] = [left + width / 2, top + height / 2];

      if (CHAT_WINDOW_WIDTH - OPEN_BTN_DIAMETER / 2 > centerX) {
        chatBoxPosition.current.right = -CHAT_WINDOW_WIDTH + OPEN_BTN_DIAMETER;
      } else {
        chatBoxPosition.current.right = 0;
      }

      if (
        CHAT_WINDOW_HEIGHT + HEADER_HEIGHT - OPEN_BTN_DIAMETER / 2 >
        centerY
      ) {
        chatBoxPosition.current.bottom =
          -CHAT_WINDOW_HEIGHT + OPEN_BTN_DIAMETER;
      } else {
        chatBoxPosition.current.bottom = 0;
      }
    }

    setIsOpen(true);
  };

  const handleOpenBtnMouseDown = () => {
    isMouseDown.current = true;
  };

  const handleOpenBtnMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleOpenBtnMouseMove = (event: MouseEvent) => {
    if (!isMouseDown.current) {
      return;
    }

    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    if (!isDragging.current) {
      isDragging.current = true;
    }

    const isOutOfPage =
      clientY < HEADER_HEIGHT + OPEN_BTN_DIAMETER / 2 ||
      clientY > innerHeight - OPEN_BTN_DIAMETER / 2 ||
      clientX < OPEN_BTN_DIAMETER / 2 ||
      clientX > innerWidth - OPEN_BTN_DIAMETER / 2;

    if (isOutOfPage) {
      return;
    }

    setBoxPosition({
      bottom: innerHeight - clientY - OPEN_BTN_DIAMETER / 2,
      right: innerWidth - clientX - OPEN_BTN_DIAMETER / 2,
    });
  };

  const handleClickAwayListener = (event: MouseEvent) => {
    const isContain = chatBoxRef.current?.contains(event.target as Node);
    if (isContain) {
      return;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleOpenBtnMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleOpenBtnMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickAwayListener);
      }, 0);
    }

    return () => {
      if (isOpen) {
        document.removeEventListener('click', handleClickAwayListener);
      }
    };
  }, [isOpen]);

  return (
    <Box boxPosition={boxPosition}>
      {isOpen && (
        <Wrapper
          column
          alignCenter
          chatBoxPosition={chatBoxPosition.current}
          ref={chatBoxRef}
        >
          <Header>
            <LogoIcon width={50} />
            <FlexDescription fontSize={1.8} color={color.blue3}>
              트롱봇에게 물어보기
            </FlexDescription>
            <CloseBtn onClick={() => setIsOpen(false)}>
              <CloseIcon width={20} height={20} />
            </CloseBtn>
          </Header>
          <Spacing height={10} />
          <Line width="fit" color="#B8B8B8" />
          <ChatHistory column>
            {chatList}
            {isLoading && chatLoadingDot}
          </ChatHistory>
          <Line width="fit" color="#B8B8B8" />
          <Spacing height={10} />
          <InputBox onSubmit={handleSubmit}>
            <Input
              ref={chatInputRef}
              type="text"
              name="text"
              placeholder={chatInputPlaceHolder.current}
              autoComplete="off"
            />
            <SubmitBtn btnSize="small" btnColor="blue">
              전송
            </SubmitBtn>
          </InputBox>
        </Wrapper>
      )}
      {!isOpen && (
        <OpenBtn
          onClick={handleOpenBtnClick}
          onMouseDown={handleOpenBtnMouseDown}
          onMouseUp={handleOpenBtnMouseUp}
          ref={openBtnRef}
        >
          <ChatImg src={chatbotImgUrl} draggable={false} />
        </OpenBtn>
      )}
    </Box>
  );
};

const Box = styled(Flex)<{ boxPosition: IBoxPosition }>`
  position: absolute;
  ${({ boxPosition }) => {
    return css`
      bottom: ${boxPosition.bottom}px;
      right: ${boxPosition.right}px;
    `;
  }}
  z-index: ${CHATBOT_Z_INDEX};
`;

const Wrapper = styled(Flex)<{ chatBoxPosition: IBoxPosition }>`
  position: relative;
  ${({ chatBoxPosition }) => {
    return css`
      bottom: ${chatBoxPosition.bottom}px;
      right: ${chatBoxPosition.right}px;
    `;
  }}
  width: ${CHAT_WINDOW_WIDTH}px;
  height: ${CHAT_WINDOW_HEIGHT}px;
  padding: 20px;
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
`;

const FlexDescription = styled(Description)`
  flex-grow: 1;
  margin: 0 10px;
`;

const CloseBtn = styled.button``;

const ChatHistory = styled(Flex)`
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 20px;
  }
  gap: 20px;
  padding: 20px 0;
`;

const InputBox = styled.form`
  width: 100%;
  display: flex;
`;

const Input = styled.input`
  font-size: 1.5rem;
  flex-grow: 1;
`;

const SubmitBtn = styled(Button)``;

const ChatBox = styled(Flex)<{ isBot: boolean }>`
  flex-shrink: 0;
  ${({ isBot }) => {
    if (isBot) {
      return css``;
    }
    return css`
      flex-direction: row-reverse;
    `;
  }}
`;

const ChatImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 0 10px;
`;

const Text = styled.p<{ isBot: boolean }>`
  max-width: 220px;
  font-size: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
  line-height: 18px;
  white-space: pre-line;
  ${({ isBot }) => {
    if (isBot) {
      return css`
        background-color: ${color.blue1};
      `;
    }
    return css`
      background-color: ${color.white};
    `;
  }}
`;

const DotFlashing = styled.div`
  position: relative;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #9880ff;
  color: #9880ff;
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;
  margin-left: 10px;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
  }
  &::before {
    left: -10px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #9880ff;
    color: #9880ff;
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 0s;
  }
  &::after {
    left: 10px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #9880ff;
    color: #9880ff;
    animation: dot-flashing 1s infinite alternate;
    animation-delay: 1s;
  }

  @keyframes dot-flashing {
    0% {
      background-color: #9880ff;
    }
    50%,
    100% {
      background-color: rgba(152, 128, 255, 0.2);
    }
  }
`;

const OpenBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${OPEN_BTN_DIAMETER}px;
  height: ${OPEN_BTN_DIAMETER}px;
  border-radius: 50%;
  background-color: ${color.blue1};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  &:hover {
    background-color: ${color.blue2};
  }
`;

export default ChatBot;
