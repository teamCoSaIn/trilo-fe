import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { IChat, requestChat, TRole } from '@/api/chat';
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
import useMedia from '@/hooks/useMedia';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { UserId } from '@/states/userStatus';

interface IChatBoxPosition {
  bottom: number;
  right: number;
}

interface IChatBotTranslateValue {
  dx: number;
  dy: number;
}

const OPEN_BTN_DIAMETER = 70;
const CHAT_WINDOW_WIDTH = 400;
const CHAT_WINDOW_HEIGHT = 600;
const CHATBOT_INIT_BOTTOM = 20;
const CHATBOT_INIT_RIGHT = 20;

const ChatBot = () => {
  const { isDesktop } = useMedia();

  const CHAT_INPUT_PLACEHOLDER = {
    default: '궁금한 것을 물어보세요.',
    error: '채팅 이용 불가',
  };

  const USER: TRole = 'user';
  const ASSISTANT: TRole = 'assistant';

  const userId = useRecoilValue(UserId);

  const { data: userProfileData } = useGetUserProfile({ userId });

  const [chatBotTranslateValue, setChatBotTranslateValue] =
    useState<IChatBotTranslateValue>({
      dx: 0,
      dy: 0,
    });
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<IChat[]>([
    {
      role: ASSISTANT,
      content: `안녕하세요 ${
        (userProfileData as IUserProfile).nickName
      }님. 여행 정보에 대해 궁금하신 내용이 있으시면 물어봐주세요!`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const openBtnRef = useRef<HTMLButtonElement>(null);
  const isDragging = useRef<boolean>(false);
  const isMouseDown = useRef<boolean>(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const chatBoxPosition = useRef<IChatBoxPosition>({
    bottom: 0,
    right: 0,
  });
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatInputPlaceHolder = useRef<string>(CHAT_INPUT_PLACEHOLDER.default);

  const chatList = chatHistory.map((chat, idx) => {
    return (
      <ChatBubbleBox key={idx} isBot={chat.role === ASSISTANT}>
        <ProfileImg
          src={
            chat.role === ASSISTANT
              ? chatbotImgUrl
              : (userProfileData as IUserProfile).profileImageURL
          }
        />
        <Content isBot={chat.role === ASSISTANT}>{chat.content}</Content>
      </ChatBubbleBox>
    );
  });

  const chatLoadingDot = (
    <ChatBubbleBox isBot alignCenter>
      <ProfileImg src={chatbotImgUrl} />
      <DotFlashing />
    </ChatBubbleBox>
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (chatInputRef.current) {
      const content = chatInputRef.current.value;
      if (!content) {
        return;
      }
      const reqChat = { content, role: USER };

      setChatHistory(prev => [...prev, reqChat]);
      setIsLoading(true);
      chatInputRef.current.value = '';

      try {
        const res = await requestChat([...chatHistory, reqChat]);
        const resChat = {
          content: res.choices[0].message.content,
          role: ASSISTANT,
        };
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
        CHAT_WINDOW_HEIGHT + HEADER_HEIGHT - OPEN_BTN_DIAMETER / 2 > centerY &&
        window.innerHeight > HEADER_HEIGHT + CHAT_WINDOW_HEIGHT
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

  const handleOpenBtnMouseUp = (event: MouseEvent) => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
    }

    const isContain = openBtnRef.current?.contains(event.target as Node);
    if (!isContain && isDragging.current) {
      isDragging.current = false;
    }
  };

  const handleOpenBtnMouseMove = (event: MouseEvent) => {
    if (!isMouseDown.current) {
      return;
    }

    const { clientX, clientY, pageX, pageY } = event;
    const { innerWidth, innerHeight } = window;
    const { scrollWidth, scrollHeight } = document.documentElement;

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

    setChatBotTranslateValue({
      dy: pageY - (scrollHeight - CHATBOT_INIT_BOTTOM - OPEN_BTN_DIAMETER / 2),
      dx: pageX - (scrollWidth - CHATBOT_INIT_RIGHT - OPEN_BTN_DIAMETER / 2),
    });
  };

  const handleClickAwayListener = (event: MouseEvent) => {
    const isContain = chatBoxRef.current?.contains(event.target as Node);
    if (isContain) {
      return;
    }
    setIsOpen(false);
  };

  const handleCloseBtnClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleOpenBtnMouseMove);
    document.addEventListener('mouseup', handleOpenBtnMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleOpenBtnMouseMove);
      document.addEventListener('mouseup', handleOpenBtnMouseUp);
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

  useEffect(() => {
    setIsOpen(false);
  }, [isDesktop]);

  return (
    <Box chatBotTranslateValue={chatBotTranslateValue} isDesktop={isDesktop}>
      {isOpen && (
        <ChatBox
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
            <CloseBtn onClick={handleCloseBtnClick}>
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
        </ChatBox>
      )}
      {!isOpen && (
        <OpenBtn
          onClick={handleOpenBtnClick}
          onMouseDown={handleOpenBtnMouseDown}
          ref={openBtnRef}
        >
          <ProfileImg src={chatbotImgUrl} draggable={false} />
        </OpenBtn>
      )}
    </Box>
  );
};

const Box = styled(Flex)<{
  chatBotTranslateValue: IChatBotTranslateValue;
  isDesktop: boolean;
}>`
  position: absolute;
  bottom: ${CHATBOT_INIT_BOTTOM}px;
  right: ${CHATBOT_INIT_RIGHT}px;
  ${({ chatBotTranslateValue }) => {
    return css`
      transform: translate(
        ${chatBotTranslateValue.dx}px,
        ${chatBotTranslateValue.dy}px
      );
    `;
  }}
  ${({ isDesktop }) => {
    if (!isDesktop) {
      return css`
        display: none;
      `;
    }
  }}
  z-index: ${CHATBOT_Z_INDEX};
`;

const ChatBox = styled(Flex)<{ chatBoxPosition: IChatBoxPosition }>`
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

const ChatBubbleBox = styled(Flex)<{ isBot: boolean }>`
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

const ProfileImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 0 10px;
`;

const Content = styled.p<{ isBot: boolean }>`
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
  &:active {
    background-color: ${color.blue2};
  }
`;

export default ChatBot;
