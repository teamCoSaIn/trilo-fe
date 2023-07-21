import { FormEvent, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { requestChat } from '@/api/chat';
import { IUserProfile } from '@/api/user';
import defaultProfile from '@/assets/defaultProfileImg.png';
import { ReactComponent as CloseIcon } from '@/assets/multiply.svg';
import Button from '@/components/common/Button';
import Description from '@/components/common/Description';
import Flex from '@/components/common/Flex';
import Line from '@/components/common/Line';
import Spacing from '@/components/common/Spacing';
import useGetUserProfile from '@/queryHooks/useGetUserProfile';
import { UserId } from '@/states/userStatus';

interface Chat {
  isBot: boolean;
  text: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([
    { text: '안녕하세요 용사님', isBot: true },
    { text: '네 안녕하세요', isBot: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatInputRef = useRef<HTMLInputElement>(null);

  const userId = useRecoilValue(UserId);

  const { data: userProfileData } = useGetUserProfile({ userId });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (chatInputRef.current) {
      const text = chatInputRef.current.value;
      const reqChat = { text, isBot: false };

      setChatHistory(prev => [...prev, reqChat]);
      setIsLoading(true);
      chatInputRef.current.value = '';

      try {
        const res = await requestChat(text);
        const resChat = { text: res.choices[0].message.content, isBot: true };
        setIsLoading(false);
        setChatHistory(prev => [...prev, resChat]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box>
      {isOpen && (
        <Wrapper column alignCenter>
          <Header>
            <BotImg src={defaultProfile} />
            <FlexDescription fontSize={2}>챗봇과 대화하기</FlexDescription>
            <CloseBtn onClick={() => setIsOpen(false)}>
              <CloseIcon width={20} height={20} />
            </CloseBtn>
          </Header>
          <Spacing height={10} />
          <Line width={350} color="gray" />
          <ChatHistory column>
            {chatHistory.map((chat, idx) => {
              return (
                <ChatBox key={idx} isBot={chat.isBot} alignCenter>
                  <ChatImg
                    src={
                      chat.isBot
                        ? defaultProfile
                        : (userProfileData as IUserProfile).profileImageURL
                    }
                  />
                  <Text>{chat.text}</Text>
                </ChatBox>
              );
            })}
            {isLoading && (
              <ChatBox isBot alignCenter>
                <ChatImg src={defaultProfile} />
                <DotFlashing />
              </ChatBox>
            )}
          </ChatHistory>
          <Spacing height={10} />
          <Line width={350} color="gray" />
          <Spacing height={10} />
          <InputBox onSubmit={handleSubmit}>
            <Input
              ref={chatInputRef}
              type="text"
              name="text"
              placeholder="궁금한 것을 물어보세요."
              autoComplete="off"
            />
            <SubmitBtn btnSize="small" btnColor="blue">
              전송
            </SubmitBtn>
          </InputBox>
        </Wrapper>
      )}
      {!isOpen && <OpenBtn onClick={() => setIsOpen(true)}>챗봇</OpenBtn>}
    </Box>
  );
};

const Box = styled(Flex)`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const Wrapper = styled(Flex)`
  width: 400px;
  height: 600px;
  padding: 20px;
  border: 1px solid black;
  background-color: white;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
`;

const BotImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
`;

const InputBox = styled.form`
  width: 100%;
  display: flex;
`;

const Input = styled.input`
  font-size: 2rem;
  flex-grow: 1;
`;

const SubmitBtn = styled(Button)``;

const ChatBox = styled(Flex)<{ isBot: boolean }>`
  height: 40px;
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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 10px;
`;

const Text = styled.p``;

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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: blue;
  color: white;
`;

export default ChatBot;
